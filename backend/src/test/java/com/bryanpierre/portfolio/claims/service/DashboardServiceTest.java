package com.bryanpierre.portfolio.claims.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.bryanpierre.portfolio.claims.dto.response.DashboardSummaryResponse;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ClaimRepository claimRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getSummary_returnsCountsForAllStatuses() {
        when(claimRepository.count()).thenReturn(6L);
        when(claimRepository.countByStatus(ClaimStatus.SUBMITTED)).thenReturn(1L);
        when(claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW)).thenReturn(2L);
        when(claimRepository.countByStatus(ClaimStatus.NEEDS_INFO)).thenReturn(3L);
        when(claimRepository.countByStatus(ClaimStatus.APPROVED)).thenReturn(3L);
        when(claimRepository.countByStatus(ClaimStatus.DENIED)).thenReturn(4L);
        when(claimRepository.countByStatus(ClaimStatus.CLOSED)).thenReturn(5L);

        DashboardSummaryResponse summary = dashboardService.getSummary();

        assertEquals(6L, summary.getTotalClaims());
        assertEquals(1L, summary.getSubmittedClaims());
        assertEquals(2L, summary.getUnderReviewClaims());
        assertEquals(3L, summary.getNeedsInfoClaims());
        assertEquals(3L, summary.getApprovedClaims());
        assertEquals(4L, summary.getDeniedClaims());
        assertEquals(5L, summary.getClosedClaims());
    }
}
