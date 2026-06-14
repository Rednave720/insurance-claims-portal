package com.bryanpierre.portfolio.claims.service;

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
        Long reviewerUserId = request.getReviewerUserId();
        if (reviewerUserId == null) {
            throw new BadRequestException("Reviewer user id is required.");
        }

        User admin = userRepository.findById(reviewerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin user not found: " + reviewerUserId));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("Only an admin reviewer can update claim status.");
        }

        if (claim.getStatus() == ClaimStatus.CLOSED) {
            throw new BadRequestException("Closed claims cannot be updated in the MVP workflow.");
        }

        if (claim.getStatus() == request.getNewStatus()) {
            throw new BadRequestException("New status must be different from the current status.");
        }

        if (request.getNewStatus() == ClaimStatus.SUBMITTED) {
            throw new BadRequestException("Claims cannot be moved back to submitted after review begins.");
        }

        if (requiresReviewerNote(request.getNewStatus()) && isBlank(request.getNote())) {
            throw new BadRequestException("A reviewer note is required for this status update.");
        }

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

    private boolean requiresReviewerNote(ClaimStatus status) {
        return status == ClaimStatus.NEEDS_INFO || status == ClaimStatus.DENIED;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
