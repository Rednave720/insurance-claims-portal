# REST API Endpoint Plan

## Purpose

This document defines the MVP REST API plan for the Insurance Claims Management Portal.

The API should support the core workflow: a claimant submits a claim, views their claims, an admin reviews claims, updates status, and the system records history.

Base path placeholder:

```text
/api
```

## Users

### Get Current Mock User

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/users/me` | Return the active mock or seeded user |

#### Example Response

```json
{
  "id": 1,
  "firstName": "Jordan",
  "lastName": "Taylor",
  "email": "jordan.taylor@example.com",
  "role": "CLAIMANT"
}
```

#### MVP Notes

Use this endpoint only if helpful for the frontend. A simpler early version can hard-code the active role in the UI during development.

### List Seeded Users

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/users` | Return seeded users for mock role switching |

#### Example Response

```json
[
  {
    "id": 1,
    "firstName": "Jordan",
    "lastName": "Taylor",
    "email": "jordan.taylor@example.com",
    "role": "CLAIMANT"
  },
  {
    "id": 2,
    "firstName": "Morgan",
    "lastName": "Reed",
    "email": "morgan.reed@example.com",
    "role": "ADMIN"
  }
]
```

#### MVP Notes

This supports simple development without full authentication.

## Claims

### Create Claim

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/claims` | Submit a new claim |

#### Example Request

```json
{
  "claimantId": 1,
  "claimType": "AUTO",
  "incidentDate": "2026-06-10",
  "description": "Rear-end collision while stopped at a traffic light."
}
```

#### Example Response

```json
{
  "id": 101,
  "claimNumber": "CLM-1001",
  "claimantId": 1,
  "claimType": "AUTO",
  "incidentDate": "2026-06-10",
  "description": "Rear-end collision while stopped at a traffic light.",
  "status": "SUBMITTED",
  "submittedAt": "2026-06-15T09:30:00",
  "updatedAt": "2026-06-15T09:30:00"
}
```

#### MVP Notes

Creating a claim should also create the first `ClaimHistory` entry.

### Get Claims

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/claims` | Return claims, optionally filtered |

#### Query Parameters

```text
claimantId=1
status=UNDER_REVIEW
search=CLM-1001
```

#### Example Response

```json
[
  {
    "id": 101,
    "claimNumber": "CLM-1001",
    "claimantName": "Jordan Taylor",
    "claimType": "AUTO",
    "status": "SUBMITTED",
    "incidentDate": "2026-06-10",
    "submittedAt": "2026-06-15T09:30:00"
  }
]
```

#### MVP Notes

- Claimants should only see their own claims
- Admins can see all claims
- Filtering can start simple and grow later

### Get Claim By ID

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/claims/{claimId}` | Return claim detail |

#### Example Response

```json
{
  "id": 101,
  "claimNumber": "CLM-1001",
  "claimant": {
    "id": 1,
    "name": "Jordan Taylor",
    "email": "jordan.taylor@example.com"
  },
  "claimType": "AUTO",
  "incidentDate": "2026-06-10",
  "description": "Rear-end collision while stopped at a traffic light.",
  "status": "UNDER_REVIEW",
  "submittedAt": "2026-06-15T09:30:00",
  "updatedAt": "2026-06-15T11:15:00"
}
```

#### MVP Notes

Documents and history can be returned from separate endpoints to keep the response simple.

## Claim Status Updates

### Update Claim Status

| Method | Route | Purpose |
| --- | --- | --- |
| `PATCH` | `/api/claims/{claimId}/status` | Admin updates claim status |

#### Example Request

```json
{
  "changedBy": 2,
  "newStatus": "NEEDS_INFO",
  "note": "Additional repair estimate needed before a final decision."
}
```

#### Example Response

```json
{
  "id": 101,
  "claimNumber": "CLM-1001",
  "previousStatus": "SUBMITTED",
  "newStatus": "UNDER_REVIEW",
  "updatedAt": "2026-06-15T11:15:00"
}
```

#### MVP Notes

- Only admins should update status
- Each status update should create a `ClaimHistory` entry
- Do not overbuild workflow rules yet
- The backend also accepts `adminUserId` for compatibility with the first MVP implementation

## Documents

### Add Document Metadata

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/claims/{claimId}/documents` | Add supporting document metadata |

#### Example Request

```json
{
  "uploadedByUserId": 1,
  "fileName": "repair-estimate.pdf",
  "documentType": "REPAIR_ESTIMATE",
  "fileUrl": "https://example.com/mock-files/repair-estimate.pdf"
}
```

#### Example Response

```json
{
  "id": 501,
  "claimId": 101,
  "fileName": "repair-estimate.pdf",
  "documentType": "REPAIR_ESTIMATE",
  "fileUrl": "https://example.com/mock-files/repair-estimate.pdf",
  "uploadedAt": "2026-06-15T10:05:00"
}
```

#### MVP Notes

Store metadata or mock URLs only. Real file uploads can come later.

### Get Claim Documents

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/claims/{claimId}/documents` | Return documents for a claim |

#### Example Response

```json
[
  {
    "id": 501,
    "claimId": 101,
    "fileName": "repair-estimate.pdf",
    "documentType": "REPAIR_ESTIMATE",
    "fileUrl": "https://example.com/mock-files/repair-estimate.pdf",
    "uploadedAt": "2026-06-15T10:05:00"
  }
]
```

#### MVP Notes

Do not add delete or download behavior until the basic workflow is stable.

## Claim History

### Get Claim History

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/claims/{claimId}/history` | Return timeline events for a claim |

#### Example Response

```json
[
  {
    "id": 9001,
    "claimId": 101,
    "changedBy": "Jordan Taylor",
    "previousStatus": null,
    "newStatus": "SUBMITTED",
    "note": "Claim submitted.",
    "createdAt": "2026-06-15T09:30:00"
  },
  {
    "id": 9002,
    "claimId": 101,
    "changedBy": "Morgan Reed",
    "previousStatus": "SUBMITTED",
    "newStatus": "UNDER_REVIEW",
    "note": "Initial review started. Waiting for supporting repair estimate.",
    "createdAt": "2026-06-15T11:15:00"
  }
]
```

#### MVP Notes

History should be read-only from the UI.

## Dashboard Summary

### Get Admin Dashboard Summary

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/dashboard/summary` | Return high-level operational claim metrics |

#### Example Response

```json
{
  "totalClaims": 24,
  "submittedClaims": 7,
  "underReviewClaims": 9,
  "approvedClaims": 5,
  "deniedClaims": 2,
  "closedClaims": 1
}
```

#### MVP Notes

Start with simple counts by status. Avoid advanced analytics until the CRUD workflow is complete.

## API Scope Boundaries

Out of scope for the MVP:

- Full JWT authentication
- Password reset
- Payment APIs
- Policy management APIs
- Real file storage
- Fraud scoring
- Email notifications
- Multi-step approval chains
- External insurance integrations
