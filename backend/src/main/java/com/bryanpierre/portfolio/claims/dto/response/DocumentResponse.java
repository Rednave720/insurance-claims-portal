package com.bryanpierre.portfolio.claims.dto.response;

import com.bryanpierre.portfolio.claims.entity.Document;
import java.time.LocalDateTime;

public class DocumentResponse {

    private final Long id;
    private final Long claimId;
    private final String fileName;
    private final String documentType;
    private final String fileUrl;
    private final Long uploadedByUserId;
    private final LocalDateTime uploadedAt;

    public DocumentResponse(
            Long id,
            Long claimId,
            String fileName,
            String documentType,
            String fileUrl,
            Long uploadedByUserId,
            LocalDateTime uploadedAt
    ) {
        this.id = id;
        this.claimId = claimId;
        this.fileName = fileName;
        this.documentType = documentType;
        this.fileUrl = fileUrl;
        this.uploadedByUserId = uploadedByUserId;
        this.uploadedAt = uploadedAt;
    }

    public static DocumentResponse fromEntity(Document document) {
        return new DocumentResponse(
                document.getId(),
                document.getClaim().getId(),
                document.getFileName(),
                document.getDocumentType(),
                document.getFileUrl(),
                document.getUploadedBy().getId(),
                document.getUploadedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public Long getClaimId() {
        return claimId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public Long getUploadedByUserId() {
        return uploadedByUserId;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}
