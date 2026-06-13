package com.bryanpierre.portfolio.claims.dto.request;

import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateClaimStatusRequest {

    @NotNull
    private Long adminUserId;

    @NotNull
    private ClaimStatus newStatus;

    private String note;

    public Long getAdminUserId() {
        return adminUserId;
    }

    public void setAdminUserId(Long adminUserId) {
        this.adminUserId = adminUserId;
    }

    public ClaimStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ClaimStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
