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
            User jordan = upsertUser(userRepository, "Jordan", "Taylor",
                    "jordan.taylor@example.com", UserRole.CLAIMANT);
            User priya = upsertUser(userRepository, "Priya", "Shah",
                    "priya.shah@example.com", UserRole.CLAIMANT);
            User morgan = upsertUser(userRepository, "Morgan", "Reed",
                    "morgan.reed@example.com", UserRole.ADMIN);

            if (claimRepository.count() > 0) {
                return;
            }

            LocalDate today = LocalDate.now();
            LocalDateTime now = LocalDateTime.now();

            Claim c1 = saveClaim(claimRepository, jordan, "CLM-1001", "AUTO",
                    "Rear-end collision while stopped at a traffic light on Westheimer Rd. "
                            + "Minor bumper damage, no injuries reported.",
                    today.minusDays(3), ClaimStatus.UNDER_REVIEW,
                    now.minusDays(3), now.minusDays(1));
            addHistory(claimHistoryRepository, c1, jordan, null, ClaimStatus.SUBMITTED,
                    "Claim submitted via claimant portal.", now.minusDays(3));
            addHistory(claimHistoryRepository, c1, morgan, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                    "Assigned to adjuster. Reviewing attached repair estimate.", now.minusDays(1));
            addDocument(documentRepository, c1, jordan, "repair-estimate.pdf",
                    "REPAIR_ESTIMATE", "https://example.com/mock-documents/repair-estimate.pdf",
                    now.minusDays(3));
            addDocument(documentRepository, c1, jordan, "accident-scene-front.jpg",
                    "PHOTO", "https://example.com/mock-documents/accident-scene-front.jpg",
                    now.minusDays(3));

            Claim c2 = saveClaim(claimRepository, priya, "CLM-1002", "PROPERTY",
                    "Water damage to kitchen ceiling following upstairs neighbor's washing machine leak. "
                            + "Photos and plumber's report attached.",
                    today.minusDays(7), ClaimStatus.NEEDS_INFO,
                    now.minusDays(7), now.minusDays(2));
            addHistory(claimHistoryRepository, c2, priya, null, ClaimStatus.SUBMITTED,
                    "Claim submitted via claimant portal.", now.minusDays(7));
            addHistory(claimHistoryRepository, c2, morgan, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                    "Adjuster assigned.", now.minusDays(5));
            addHistory(claimHistoryRepository, c2, morgan, ClaimStatus.UNDER_REVIEW, ClaimStatus.NEEDS_INFO,
                    "Need a copy of the building incident report and one additional photo of the affected area.",
                    now.minusDays(2));
            addDocument(documentRepository, c2, priya, "plumber-report.pdf",
                    "OTHER", "https://example.com/mock-documents/plumber-report.pdf",
                    now.minusDays(7));

            Claim c3 = saveClaim(claimRepository, jordan, "CLM-1003", "AUTO",
                    "Driver-side mirror damaged in parking garage. "
                            + "Other driver left contact information at the scene.",
                    today.minusDays(14), ClaimStatus.APPROVED,
                    now.minusDays(14), now.minusDays(4));
            addHistory(claimHistoryRepository, c3, jordan, null, ClaimStatus.SUBMITTED,
                    "Claim submitted via claimant portal.", now.minusDays(14));
            addHistory(claimHistoryRepository, c3, morgan, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                    "Reviewing photos and other driver's contact info.", now.minusDays(10));
            addHistory(claimHistoryRepository, c3, morgan, ClaimStatus.UNDER_REVIEW, ClaimStatus.APPROVED,
                    "Approved for repair coverage up to deductible. Payout scheduled.", now.minusDays(4));

            Claim c4 = saveClaim(claimRepository, priya, "CLM-1004", "HEALTH",
                    "Emergency urgent care visit for treatment of allergic reaction. "
                            + "Itemized invoice attached.",
                    today.minusDays(1), ClaimStatus.SUBMITTED,
                    now.minusHours(6), now.minusHours(6));
            addHistory(claimHistoryRepository, c4, priya, null, ClaimStatus.SUBMITTED,
                    "Claim received and queued for adjuster assignment.", now.minusHours(6));
            addDocument(documentRepository, c4, priya, "urgent-care-invoice.pdf",
                    "RECEIPT", "https://example.com/mock-documents/urgent-care-invoice.pdf",
                    now.minusHours(6));

            Claim c5 = saveClaim(claimRepository, priya, "CLM-1005", "PROPERTY",
                    "Roof shingle damage from hailstorm on June 4. Contractor estimate attached.",
                    today.minusDays(21), ClaimStatus.DENIED,
                    now.minusDays(21), now.minusDays(9));
            addHistory(claimHistoryRepository, c5, priya, null, ClaimStatus.SUBMITTED,
                    "Claim submitted via claimant portal.", now.minusDays(21));
            addHistory(claimHistoryRepository, c5, morgan, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                    "Reviewing contractor estimate and storm date documentation.", now.minusDays(15));
            addHistory(claimHistoryRepository, c5, morgan, ClaimStatus.UNDER_REVIEW, ClaimStatus.DENIED,
                    "Denied - damage falls outside the coverage period documented in the active policy.",
                    now.minusDays(9));
            addDocument(documentRepository, c5, priya, "roof-photo-north.jpg",
                    "PHOTO", "https://example.com/mock-documents/roof-photo-north.jpg",
                    now.minusDays(21));
            addDocument(documentRepository, c5, priya, "contractor-estimate.pdf",
                    "REPAIR_ESTIMATE", "https://example.com/mock-documents/contractor-estimate.pdf",
                    now.minusDays(21));

            Claim c6 = saveClaim(claimRepository, jordan, "CLM-1006", "AUTO",
                    "Windshield chip from highway debris repaired at certified shop.",
                    today.minusDays(40), ClaimStatus.CLOSED,
                    now.minusDays(40), now.minusDays(18));
            addHistory(claimHistoryRepository, c6, jordan, null, ClaimStatus.SUBMITTED,
                    "Claim submitted via claimant portal.", now.minusDays(40));
            addHistory(claimHistoryRepository, c6, morgan, ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW,
                    "Reviewing repair receipt and shop certification.", now.minusDays(35));
            addHistory(claimHistoryRepository, c6, morgan, ClaimStatus.UNDER_REVIEW, ClaimStatus.APPROVED,
                    "Repair approved. Reimbursement issued to claimant.", now.minusDays(22));
            addHistory(claimHistoryRepository, c6, morgan, ClaimStatus.APPROVED, ClaimStatus.CLOSED,
                    "Claim closed after successful reimbursement.", now.minusDays(18));
            addDocument(documentRepository, c6, jordan, "windshield-repair-receipt.pdf",
                    "RECEIPT", "https://example.com/mock-documents/windshield-repair-receipt.pdf",
                    now.minusDays(40));
        };
    }

    private User upsertUser(UserRepository repo, String firstName, String lastName, String email, UserRole role) {
        return repo.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setRole(role);
            return repo.save(user);
        });
    }

    private Claim saveClaim(
            ClaimRepository repo,
            User claimant,
            String claimNumber,
            String claimType,
            String description,
            LocalDate incidentDate,
            ClaimStatus status,
            LocalDateTime submittedAt,
            LocalDateTime updatedAt
    ) {
        Claim claim = new Claim();
        claim.setClaimant(claimant);
        claim.setClaimNumber(claimNumber);
        claim.setClaimType(claimType);
        claim.setDescription(description);
        claim.setIncidentDate(incidentDate);
        claim.setStatus(status);
        claim.setSubmittedAt(submittedAt);
        claim.setUpdatedAt(updatedAt);
        return repo.save(claim);
    }

    private void addHistory(
            ClaimHistoryRepository repo,
            Claim claim,
            User changedBy,
            ClaimStatus previousStatus,
            ClaimStatus newStatus,
            String note,
            LocalDateTime createdAt
    ) {
        ClaimHistory history = new ClaimHistory();
        history.setClaim(claim);
        history.setChangedBy(changedBy);
        history.setPreviousStatus(previousStatus);
        history.setNewStatus(newStatus);
        history.setNote(note);
        history.setCreatedAt(createdAt);
        repo.save(history);
    }

    private void addDocument(
            DocumentRepository repo,
            Claim claim,
            User uploadedBy,
            String fileName,
            String documentType,
            String fileUrl,
            LocalDateTime uploadedAt
    ) {
        Document document = new Document();
        document.setClaim(claim);
        document.setUploadedBy(uploadedBy);
        document.setFileName(fileName);
        document.setDocumentType(documentType);
        document.setFileUrl(fileUrl);
        document.setUploadedAt(uploadedAt);
        repo.save(document);
    }
}
