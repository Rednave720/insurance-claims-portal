package com.bryanpierre.portfolio.claims.controller;

import com.bryanpierre.portfolio.claims.dto.response.ClaimHistoryResponse;
import com.bryanpierre.portfolio.claims.repository.ClaimHistoryRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims/{claimId}/history")
public class ClaimHistoryController {

    private final ClaimHistoryRepository claimHistoryRepository;

    public ClaimHistoryController(ClaimHistoryRepository claimHistoryRepository) {
        this.claimHistoryRepository = claimHistoryRepository;
    }

    @GetMapping
    public List<ClaimHistoryResponse> getClaimHistory(@PathVariable Long claimId) {
        return claimHistoryRepository.findByClaimIdOrderByCreatedAtAsc(claimId).stream()
                .map(ClaimHistoryResponse::fromEntity)
                .toList();
    }
}
