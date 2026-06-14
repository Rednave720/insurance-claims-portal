package com.bryanpierre.portfolio.claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import com.bryanpierre.portfolio.claims.dto.request.CreateClaimRequest;
import com.bryanpierre.portfolio.claims.dto.request.UpdateClaimStatusRequest;
import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.entity.ClaimHistory;
import com.bryanpierre.portfolio.claims.entity.User;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import com.bryanpierre.portfolio.claims.enums.UserRole;
import com.bryanpierre.portfolio.claims.exception.BadRequestException;
import com.bryanpierre.portfolio.claims.repository.ClaimHistoryRepository;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import com.bryanpierre.portfolio.claims.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClaimServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ClaimHistoryRepository claimHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ClaimService claimService;

    @Test
    void getClaims_returnsClaimsForClaimantWhenIdProvided() {
        List<Claim> expectedClaims = List.of(new Claim());
        when(claimRepository.findByClaimantId(42L)).thenReturn(expectedClaims);

        List<Claim> actualClaims = claimService.getClaims(42L);

        assertSame(expectedClaims, actualClaims);
        verify(claimRepository).findByClaimantId(42L);
        verifyNoMoreInteractions(claimRepository);
    }

    @Test
    void getClaims_returnsAllClaimsWhenClaimantIdIsNull() {
        List<Claim> expectedClaims = List.of(new Claim(), new Claim());
        when(claimRepository.findAll()).thenReturn(expectedClaims);

        List<Claim> actualClaims = claimService.getClaims(null);

        assertSame(expectedClaims, actualClaims);
        verify(claimRepository).findAll();
    }

    @Test
    void getClaimById_returnsClaimWhenPresent() {
        Claim claim = new Claim();
        claim.setId(7L);
        when(claimRepository.findById(7L)).thenReturn(Optional.of(claim));

        Claim actualClaim = claimService.getClaimById(7L);

        assertSame(claim, actualClaim);
    }

    @Test
    void getClaimById_throwsWhenClaimDoesNotExist() {
        when(claimRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> claimService.getClaimById(99L));

        assertEquals("Claim not found: 99", exception.getMessage());
    }

    @Test
    void createClaim_persistsNewClaimAndHistory() {
        User claimant = new User();
        claimant.setId(1L);
        claimant.setRole(UserRole.CLAIMANT);

        CreateClaimRequest request = new CreateClaimRequest();
        request.setClaimantId(1L);
        request.setClaimType("Vehicle");
        request.setIncidentDate(LocalDate.of(2026, 6, 10));
        request.setDescription("Rear-end collision");

        when(userRepository.findById(1L)).thenReturn(Optional.of(claimant));
        when(claimRepository.count()).thenReturn(0L);
        when(claimRepository.save(any(Claim.class))).thenAnswer(invocation -> {
            Claim savedClaim = invocation.getArgument(0);
            savedClaim.setId(10L);
            return savedClaim;
        });

        Claim result = claimService.createClaim(request);

        assertEquals(10L, result.getId());
        assertEquals(ClaimStatus.SUBMITTED, result.getStatus());
        assertEquals("CLM-1001", result.getClaimNumber());
        assertNotNull(result.getSubmittedAt());
        assertNotNull(result.getUpdatedAt());
        verify(claimHistoryRepository).save(any(ClaimHistory.class));
    }

    @Test
    void updateClaimStatus_allowsAdminReviewAndRecordsHistory() {
        Claim claim = new Claim();
        claim.setId(7L);
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setUpdatedAt(LocalDateTime.now().minusDays(1));

        User admin = new User();
        admin.setId(99L);
        admin.setRole(UserRole.ADMIN);

        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setAdminUserId(99L);
        request.setNewStatus(ClaimStatus.UNDER_REVIEW);
        request.setNote("Needs investigation");

        when(claimRepository.findById(7L)).thenReturn(Optional.of(claim));
        when(userRepository.findById(99L)).thenReturn(Optional.of(admin));
        when(claimRepository.save(any(Claim.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Claim updatedClaim = claimService.updateClaimStatus(7L, request);

        assertEquals(ClaimStatus.UNDER_REVIEW, updatedClaim.getStatus());
        assertNotNull(updatedClaim.getUpdatedAt());
        verify(claimHistoryRepository).save(any(ClaimHistory.class));
    }

    @Test
    void updateClaimStatus_rejectsNonAdminReviewers() {
        Claim claim = new Claim();
        claim.setId(7L);
        claim.setStatus(ClaimStatus.SUBMITTED);

        User claimant = new User();
        claimant.setId(5L);
        claimant.setRole(UserRole.CLAIMANT);

        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setAdminUserId(5L);
        request.setNewStatus(ClaimStatus.UNDER_REVIEW);

        when(claimRepository.findById(7L)).thenReturn(Optional.of(claim));
        when(userRepository.findById(5L)).thenReturn(Optional.of(claimant));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> claimService.updateClaimStatus(7L, request));

        assertEquals("Only an admin reviewer can update claim status.", exception.getMessage());
    }
}
