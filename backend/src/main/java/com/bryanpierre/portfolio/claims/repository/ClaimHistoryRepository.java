package com.bryanpierre.portfolio.claims.repository;

import com.bryanpierre.portfolio.claims.entity.ClaimHistory;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimHistoryRepository extends JpaRepository<ClaimHistory, Long> {
    @EntityGraph(attributePaths = {"claim", "changedBy"})
    List<ClaimHistory> findByClaimIdOrderByCreatedAtAsc(Long claimId);
}
