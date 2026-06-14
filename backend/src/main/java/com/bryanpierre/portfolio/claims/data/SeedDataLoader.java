package com.bryanpierre.portfolio.claims.data;

import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.entity.ClaimHistory;
import com.bryanpierre.portfolio.claims.entity.Document;
import com.bryanpierre.portfolio.claims.entity.User;
import com.bryanpierre.portfolio.claims.enums.ClaimStatus;
import com.bryanpierre.portfolio.claims.enums.UserRole;
import com.bryanpierre.portfolio.claims.repository.ClaimHistoryRepository;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import com.bryanpierre.portfolio.claims.repository.DocumentRepository;
import com.bryanpierre.portfolio.claims.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataLoader {

    @Bean
    CommandLineRunner seedDemoData(
            UserRepository userRepository,
            ClaimRepository claimRepository,
            ClaimHistoryRepository claimHistoryRepository,
            DocumentRepository documentRepository
    ) {
        return args -> {
            User claimant = userRepository.findByEmail("jordan.taylor@example.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setFirstName("Jordan");
                        user.setLastName("Taylor");
                        user.setEmail("jordan.taylor@example.com");
                        user.setRole(UserRole.CLAIMANT);
                        return userRepository.save(user);
                    });

            userRepository.findByEmail("morgan.reed@example.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setFirstName("Morgan");
                        user.setLastName("Reed");
                        user.setEmail("morgan.reed@example.com");
                        user.setRole(UserRole.ADMIN);
                        return userRepository.save(user);
                    });

            if (claimRepository.count() > 0) {
                return;
            }

            Claim claim = new Claim();
            claim.setClaimant(claimant);
            claim.setClaimNumber("CLM-1001");
            claim.setClaimType("AUTO");
            claim.setDescription("Rear-end collision while stopped at a traffic light.");
            claim.setIncidentDate(LocalDate.now().minusDays(3));
            claim.setStatus(ClaimStatus.SUBMITTED);
            claim.setSubmittedAt(LocalDateTime.now().minusDays(1));
            claim.setUpdatedAt(LocalDateTime.now().minusDays(1));
            Claim savedClaim = claimRepository.save(claim);

            ClaimHistory history = new ClaimHistory();
            history.setClaim(savedClaim);
            history.setChangedBy(claimant);
            history.setPreviousStatus(null);
            history.setNewStatus(ClaimStatus.SUBMITTED);
            history.setNote("Claim submitted.");
            claimHistoryRepository.save(history);

            Document document = new Document();
            document.setClaim(savedClaim);
            document.setUploadedBy(claimant);
            document.setFileName("repair-estimate.pdf");
            document.setDocumentType("REPAIR_ESTIMATE");
            document.setFileUrl("https://example.com/mock-documents/repair-estimate.pdf");
            documentRepository.save(document);
        };
    }
}
