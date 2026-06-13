package com.bryanpierre.portfolio.claims.service;

import com.bryanpierre.portfolio.claims.dto.request.CreateClaimRequest;
import com.bryanpierre.portfolio.claims.dto.request.UpdateClaimStatusRequest;
import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.entity.ClaimHistory;
import com.bryanpierre.portfolio.claims.entity.User;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import com.bryanpierre.portfolio.claims.repository.ClaimHistoryRepository;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import com.bryanpierre.portfolio.claims.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final UserRepository userRepository;

    public ClaimService(
            ClaimRepository claimRepository,
            ClaimHistoryRepository claimHistoryRepository,
            UserRepository userRepository
    ) {
        this.claimRepository = claimRepository;
        this.claimHistoryRepository = claimHistoryRepository;
        this.userRepository = userRepository;
    }

    public List<Claim> getClaims(Long claimantId) {
        if (claimantId != null) {
            return claimRepository.findByClaimantId(claimantId);
        }
        return claimRepository.findAll();
    }

    public Claim getClaimById(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + claimId));
    }

    @Transactional
    public Claim createClaim(CreateClaimRequest request) {
        User claimant = userRepository.findById(request.getClaimantId())
                .orElseThrow(() -> new IllegalArgumentException("Claimant not found: " + request.getClaimantId()));

        Claim claim = new Claim();
        claim.setClaimant(claimant);
        claim.setClaimNumber(generateClaimNumber());
        claim.setClaimType(request.getClaimType());
        claim.setIncidentDate(request.getIncidentDate());
        claim.setDescription(request.getDescription());
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setSubmittedAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        Claim savedClaim = claimRepository.save(claim);

        ClaimHistory history = new ClaimHistory();
        history.setClaim(savedClaim);
        history.setChangedBy(claimant);
        history.setPreviousStatus(null);
        history.setNewStatus(ClaimStatus.SUBMITTED);
        history.setNote("Claim submitted.");
        claimHistoryRepository.save(history);

        return savedClaim;
    }

    @Transactional
    public Claim updateClaimStatus(Long claimId, UpdateClaimStatusRequest request) {
        Claim claim = getClaimById(claimId);
        User admin = userRepository.findById(request.getAdminUserId())
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + request.getAdminUserId()));

        ClaimStatus previousStatus = claim.getStatus();
        claim.setStatus(request.getNewStatus());
        claim.setUpdatedAt(LocalDateTime.now());
        Claim savedClaim = claimRepository.save(claim);

        ClaimHistory history = new ClaimHistory();
        history.setClaim(savedClaim);
        history.setChangedBy(admin);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(request.getNewStatus());
        history.setNote(request.getNote());
        claimHistoryRepository.save(history);

        return savedClaim;
    }

    private String generateClaimNumber() {
        long nextNumber = claimRepository.count() + 1001;
        return "CLM-" + nextNumber;
    }
}
