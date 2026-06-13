package com.bryanpierre.portfolio.claims.repository;

import com.bryanpierre.portfolio.claims.entity.Document;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    @EntityGraph(attributePaths = {"claim", "uploadedBy"})
    List<Document> findByClaimId(Long claimId);
}
