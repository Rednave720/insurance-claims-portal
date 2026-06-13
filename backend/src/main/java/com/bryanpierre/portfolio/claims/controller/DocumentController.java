package com.bryanpierre.portfolio.claims.controller;

import com.bryanpierre.portfolio.claims.dto.request.AddDocumentRequest;
import com.bryanpierre.portfolio.claims.dto.response.DocumentResponse;
import com.bryanpierre.portfolio.claims.entity.Claim;
import com.bryanpierre.portfolio.claims.entity.Document;
import com.bryanpierre.portfolio.claims.entity.User;
import com.bryanpierre.portfolio.claims.repository.ClaimRepository;
import com.bryanpierre.portfolio.claims.repository.DocumentRepository;
import com.bryanpierre.portfolio.claims.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/claims/{claimId}/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public DocumentController(
            DocumentRepository documentRepository,
            ClaimRepository claimRepository,
            UserRepository userRepository
    ) {
        this.documentRepository = documentRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<DocumentResponse> getDocuments(@PathVariable Long claimId) {
        return documentRepository.findByClaimId(claimId).stream()
                .map(DocumentResponse::fromEntity)
                .toList();
    }

    @PostMapping
    public DocumentResponse addDocument(
            @PathVariable Long claimId,
            @Valid @RequestBody AddDocumentRequest request
    ) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + claimId));
        User uploadedBy = userRepository.findById(request.getUploadedByUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getUploadedByUserId()));

        Document document = new Document();
        document.setClaim(claim);
        document.setUploadedBy(uploadedBy);
        document.setFileName(request.getFileName());
        document.setDocumentType(request.getDocumentType());
        document.setFileUrl(request.getFileUrl());

        return DocumentResponse.fromEntity(documentRepository.save(document));
    }
}
