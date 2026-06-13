package com.bryanpierre.portfolio.claims.dto.response;

import com.bryanpierre.portfolio.claims.entity.ClaimHistory;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import java.time.LocalDateTime;

public class ClaimHistoryResponse {

    private final Long id;
    private final Long claimId;
    private final String changedBy;
    private final ClaimStatus previousStatus;
    private final ClaimStatus newStatus;
    private final String note;
    private final LocalDateTime createdAt;

    public ClaimHistoryResponse(
            Long id,
            Long claimId,
            String changedBy,
            ClaimStatus previousStatus,
            ClaimStatus newStatus,
            String note,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.claimId = claimId;
        this.changedBy = changedBy;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.note = note;
        this.createdAt = createdAt;
    }

    public static ClaimHistoryResponse fromEntity(ClaimHistory history) {
        return new ClaimHistoryResponse(
                history.getId(),
                history.getClaim().getId(),
                history.getChangedBy().getFirstName() + " " + history.getChangedBy().getLastName(),
                history.getPreviousStatus(),
                history.getNewStatus(),
                history.getNote(),
                history.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public Long getClaimId() {
        return claimId;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public ClaimStatus getPreviousStatus() {
        return previousStatus;
    }

    public ClaimStatus getNewStatus() {
        return newStatus;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
