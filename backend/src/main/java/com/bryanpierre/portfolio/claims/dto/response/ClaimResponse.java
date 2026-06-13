package com.bryanpierre.portfolio.claims.dto.response;

import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ClaimResponse {

    private final Long id;
    private final String claimNumber;
    private final Long claimantId;
    private final String claimantName;
    private final String claimType;
    private final String description;
    private final LocalDate incidentDate;
    private final ClaimStatus status;
    private final LocalDateTime submittedAt;
    private final LocalDateTime updatedAt;

    public ClaimResponse(
            Long id,
            String claimNumber,
            Long claimantId,
            String claimantName,
            String claimType,
            String description,
            LocalDate incidentDate,
            ClaimStatus status,
            LocalDateTime submittedAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.claimNumber = claimNumber;
        this.claimantId = claimantId;
        this.claimantName = claimantName;
        this.claimType = claimType;
        this.description = description;
        this.incidentDate = incidentDate;
        this.status = status;
        this.submittedAt = submittedAt;
        this.updatedAt = updatedAt;
    }

    public static ClaimResponse fromEntity(Claim claim) {
        return new ClaimResponse(
                claim.getId(),
                claim.getClaimNumber(),
                claim.getClaimant().getId(),
                claim.getClaimant().getFirstName() + " " + claim.getClaimant().getLastName(),
                claim.getClaimType(),
                claim.getDescription(),
                claim.getIncidentDate(),
                claim.getStatus(),
                claim.getSubmittedAt(),
                claim.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public Long getClaimantId() {
        return claimantId;
    }

    public String getClaimantName() {
        return claimantName;
    }

    public String getClaimType() {
        return claimType;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getIncidentDate() {
        return incidentDate;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
