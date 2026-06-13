package com.bryanpierre.portfolio.claims.controller;

import com.bryanpierre.portfolio.claims.dto.request.CreateClaimRequest;
import com.bryanpierre.portfolio.claims.dto.request.UpdateClaimStatusRequest;
import com.bryanpierre.portfolio.claims.dto.response.ClaimResponse;
import com.bryanpierre.portfolio.claims.service.ClaimService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    public List<ClaimResponse> getClaims(@RequestParam(required = false) Long claimantId) {
        return claimService.getClaims(claimantId).stream()
                .map(ClaimResponse::fromEntity)
                .toList();
    }

    @GetMapping("/{claimId}")
    public ClaimResponse getClaimById(@PathVariable Long claimId) {
        return ClaimResponse.fromEntity(claimService.getClaimById(claimId));
    }

    @PostMapping
    public ClaimResponse createClaim(@Valid @RequestBody CreateClaimRequest request) {
        return ClaimResponse.fromEntity(claimService.createClaim(request));
    }

    @PatchMapping("/{claimId}/status")
    public ClaimResponse updateClaimStatus(
            @PathVariable Long claimId,
            @Valid @RequestBody UpdateClaimStatusRequest request
    ) {
        return ClaimResponse.fromEntity(claimService.updateClaimStatus(claimId, request));
    }
}
