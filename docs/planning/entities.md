# Data Entities

## Purpose

These entities define the MVP data model for the Insurance Claims Management Portal. The model should be simple enough to build, but realistic enough to show how enterprise systems connect users, claims, documents, statuses, and history.

## User

### Purpose

Represents a person using the system. For the MVP, users are either claimants or admins.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Long` / `UUID` | Primary key |
| `firstName` | `String` | User first name |
| `lastName` | `String` | User last name |
| `email` | `String` | Unique user email |
| `role` | `String` or enum | Example values: `CLAIMANT`, `ADMIN` |
| `createdAt` | `LocalDateTime` | Record creation timestamp |
| `updatedAt` | `LocalDateTime` | Last update timestamp |

### Relationships

- One user can have many claims
- One admin user can create many claim history entries when updating statuses

### MVP Notes

- Do not build full account registration yet
- Seed users for early development
- Keep roles simple
- Avoid password storage until authentication is intentionally added

## Claim

### Purpose

Represents an insurance claim submitted by a claimant.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Long` / `UUID` | Primary key |
| `claimNumber` | `String` | Human-readable claim reference |
| `claimantId` | `Long` / `UUID` | Links to `User` |
| `claimType` | `String` | Example: auto, property, health, other |
| `description` | `String` / `Text` | User-provided claim description |
| `incidentDate` | `LocalDate` | Date the incident occurred |
| `status` | `ClaimStatus` | Current claim status |
| `submittedAt` | `LocalDateTime` | Claim submission timestamp |
| `updatedAt` | `LocalDateTime` | Last update timestamp |

### Relationships

- Many claims belong to one claimant user
- One claim can have many documents
- One claim can have many history entries
- One claim has one current status

### MVP Notes

- Keep claim type as a small controlled list
- Do not add policy, payment, legal, fraud, or settlement logic yet
- Claim number can be generated simply, such as `CLM-1001`

## ClaimStatus

### Purpose

Represents the current workflow state of a claim.

### Suggested Enum Values

| Value | Meaning |
| --- | --- |
| `SUBMITTED` | Claim has been submitted by the claimant |
| `UNDER_REVIEW` | Admin is reviewing the claim |
| `APPROVED` | Claim has been approved |
| `DENIED` | Claim has been denied |
| `CLOSED` | Claim workflow is complete |

### Relationships

- Used by `Claim.status`
- Previous and new statuses can be recorded in `ClaimHistory`

### MVP Notes

- Use an enum in Java for clarity
- Avoid complex workflow rules at first
- Do not add status permissions beyond admin-only status updates

## Document

### Purpose

Represents supporting documentation for a claim.

For the MVP, this should be metadata or mock file URLs only. The first version does not need real file storage.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Long` / `UUID` | Primary key |
| `claimId` | `Long` / `UUID` | Links to `Claim` |
| `fileName` | `String` | Display name of document |
| `documentType` | `String` | Example: photo, receipt, police report, estimate |
| `fileUrl` | `String` | Mock or placeholder URL |
| `uploadedByUserId` | `Long` / `UUID` | Links to `User` |
| `uploadedAt` | `LocalDateTime` | Upload timestamp |

### Relationships

- Many documents belong to one claim
- Each document is uploaded by one user

### MVP Notes

- Store document metadata first
- Use mock file URLs instead of real object storage
- Do not build virus scanning, file permissions, or cloud storage yet

## ClaimHistory

### Purpose

Records important events in the life of a claim, especially status changes.

This gives the project an enterprise feel because many business systems need traceability: who changed what, when, and why.

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `Long` / `UUID` | Primary key |
| `claimId` | `Long` / `UUID` | Links to `Claim` |
| `changedByUserId` | `Long` / `UUID` | User who made the change |
| `previousStatus` | `ClaimStatus` | Nullable for first event |
| `newStatus` | `ClaimStatus` | New status after change |
| `note` | `String` / `Text` | Optional status update note |
| `createdAt` | `LocalDateTime` | Event timestamp |

### Relationships

- Many history entries belong to one claim
- Each history entry is created by one user

### MVP Notes

- Automatically create a history entry when a claim is submitted
- Automatically create a history entry when an admin changes status
- Do not allow users to edit or delete history entries

## MVP Data Model Boundaries

Keep out of scope for now:

- Policies
- Payments
- Claim reserves
- Fraud scoring
- Multi-level approvals
- Attachments stored in cloud object storage
- Complex organizational roles
- Legal or compliance workflows

These can be discussed as future enterprise enhancements after the MVP is complete.
