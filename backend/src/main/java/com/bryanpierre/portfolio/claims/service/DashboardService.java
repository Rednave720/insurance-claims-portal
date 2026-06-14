package com.bryanpierre.portfolio.claims.service;

import com.bryanpierre.portfolio.claims.dto.response.DashboardSummaryResponse;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ClaimRepository claimRepository;

    public DashboardService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public DashboardSummaryResponse getSummary() {
        return new DashboardSummaryResponse(
                claimRepository.count(),
                claimRepository.countByStatus(ClaimStatus.SUBMITTED),
                claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW),
                claimRepository.countByStatus(ClaimStatus.NEEDS_INFO),
                claimRepository.countByStatus(ClaimStatus.APPROVED),
                claimRepository.countByStatus(ClaimStatus.DENIED),
                claimRepository.countByStatus(ClaimStatus.CLOSED)
        );
    }
}
