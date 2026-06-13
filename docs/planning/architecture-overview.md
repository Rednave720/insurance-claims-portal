# Architecture Overview

## Purpose

This document explains the beginner-friendly architecture for the Insurance Claims Management Portal MVP.

The project should feel like a realistic enterprise application while staying small enough to complete and explain in interviews.

## High-Level Architecture

```text
React + Material UI Frontend
        |
        | HTTP / JSON
        v
Spring Boot REST API
        |
        | JPA / SQL
        v
PostgreSQL Database
```

The frontend handles the user experience. The backend handles business rules and API responses. The database stores the system of record.

This separation is common in enterprise systems because each layer has a clear responsibility.

## Frontend Responsibilities

The React frontend is responsible for:

- Displaying claimant and admin screens
- Collecting form input
- Showing validation messages
- Calling backend API endpoints
- Rendering claims, statuses, documents, and history
- Using Material UI for consistent enterprise-style components
- Supporting simple mock role switching during development

The frontend should not own business rules like final claim status logic. It can guide users, but the backend should decide what data is accepted.

## Backend Responsibilities

The Spring Boot backend is responsible for:

- Exposing REST API endpoints
- Validating request data
- Creating claims
- Updating claim statuses
- Creating claim history entries
- Returning dashboard summary data
- Enforcing simple role expectations for MVP behavior
- Communicating with PostgreSQL through repositories/services

The backend is where the business workflow becomes enforceable. For example, when an admin updates a status, the backend should update the claim and create a history record.

## Database Responsibilities

PostgreSQL is responsible for storing:

- Users
- Claims
- Claim statuses
- Document metadata
- Claim history

The database is the system of record. If the frontend refreshes or the backend restarts, the claim data should still exist.

For the MVP, the database should stay focused on the core workflow. Avoid adding policy, billing, fraud, legal, or payment tables until the claims workflow is complete.

## Data Flow: Claim Submission To Admin Review

1. A claimant opens the Submit Claim screen.
2. The claimant enters claim type, incident date, and description.
3. The React frontend sends a `POST /api/claims` request to the Spring Boot backend.
4. The backend validates the request.
5. The backend creates a new claim with status `SUBMITTED`.
6. The backend creates an initial claim history entry.
7. PostgreSQL stores the claim and history record.
8. The claimant sees a confirmation with a claim number.
9. An admin opens the dashboard or claims review table.
10. The frontend requests claims from `GET /api/claims`.
11. The admin opens a claim detail page.
12. The admin updates the claim status using `PATCH /api/claims/{claimId}/status`.
13. The backend updates the claim and records the status change in claim history.
14. The claimant can later view the updated status and history.

## Why This Architecture Makes Sense

This architecture is a good fit for a portfolio-sized enterprise app because it shows the major parts of real business systems without becoming too large.

### Enterprise Relevance

Enterprise teams often separate frontend, backend, and database responsibilities because:

- Different teams may work on different layers
- APIs allow systems to communicate cleanly
- Databases preserve business records
- Backend services enforce workflow rules
- Frontend apps focus on usability and task completion

For this portfolio, the architecture shows that you understand more than screens. You understand how a business process moves through a system.

### Portfolio Relevance

This project can support interview conversations about:

- Translating business workflows into software requirements
- Designing database entities
- Creating REST APIs
- Building role-based user experiences
- Managing status-driven workflows
- Explaining technical decisions in business terms

## Suggested MVP Implementation Layers

Backend:

- Controller layer for REST endpoints
- Service layer for business logic
- Repository layer for database access
- Entity/model layer for database objects
- DTO layer for request and response objects

Frontend:

- Pages for core screens
- API service functions for backend calls
- Reusable components for status chips, tables, and forms
- Simple role switcher for MVP development

Database:

- Tables for users, claims, documents, and claim history
- Enum or string field for claim status
- Seed data for one claimant and one admin

## What Is Intentionally Out Of Scope

To prevent scope creep, the MVP should not include:

- Full JWT authentication
- Password reset or account registration
- Real file storage
- Cloud deployment
- Payment processing
- Policy administration
- Fraud scoring
- Email or SMS notifications
- Complex approval chains
- Advanced analytics
- External insurance carrier integrations
- Production compliance workflows

These are valid enterprise topics, but they should be documented as future enhancements after the MVP is working.

## MVP Success Definition

The MVP is successful when:

- A claimant can submit a claim
- A claimant can view their claim status
- An admin can review submitted claims
- An admin can update claim status
- The system records status history
- Basic dashboard counts are visible
- The project can be explained clearly as a business workflow system

The goal is not to build a perfect insurance platform. The goal is to build a clear, polished, technically credible portfolio project.
