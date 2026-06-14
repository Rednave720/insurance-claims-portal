package com.bryanpierre.portfolio.claims.dto.response;

public class DashboardSummaryResponse {

    private final long totalClaims;
    private final long submittedClaims;
    private final long underReviewClaims;
    private final long needsInfoClaims;
    private final long approvedClaims;
    private final long deniedClaims;
    private final long closedClaims;

    public DashboardSummaryResponse(
            long totalClaims,
            long submittedClaims,
            long underReviewClaims,
            long needsInfoClaims,
            long approvedClaims,
            long deniedClaims,
            long closedClaims
    ) {
        this.totalClaims = totalClaims;
        this.submittedClaims = submittedClaims;
        this.underReviewClaims = underReviewClaims;
        this.needsInfoClaims = needsInfoClaims;
        this.approvedClaims = approvedClaims;
        this.deniedClaims = deniedClaims;
        this.closedClaims = closedClaims;
    }

    public long getTotalClaims() {
        return totalClaims;
    }

    public long getSubmittedClaims() {
        return submittedClaims;
    }

    public long getUnderReviewClaims() {
        return underReviewClaims;
    }

    public long getNeedsInfoClaims() {
        return needsInfoClaims;
    }

    public long getApprovedClaims() {
        return approvedClaims;
    }

    public long getDeniedClaims() {
        return deniedClaims;
    }

    public long getClosedClaims() {
        return closedClaims;
    }
}
