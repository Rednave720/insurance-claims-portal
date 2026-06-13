package com.bryanpierre.portfolio.claims.repository;

import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    @Override
    @EntityGraph(attributePaths = "claimant")
    List<Claim> findAll();

    @Override
    @EntityGraph(attributePaths = "claimant")
    Optional<Claim> findById(Long id);

    @EntityGraph(attributePaths = "claimant")
    List<Claim> findByClaimantId(Long claimantId);

    long countByStatus(ClaimStatus status);
}
