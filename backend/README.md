# Insurance Claims Backend

Spring Boot REST API for the Insurance Claims Management Portal.

## Current Purpose

This backend is the first technical layer of the MVP. It starts with the package structure, entities, repositories, services, controllers, DTOs, and seed data needed to support the claims workflow described in `docs/planning`.

## Tech Stack

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- PostgreSQL
- Maven

## Package Guide

```text
src/main/java/com/bryanpierre/portfolio/claims
├── config
├── controller
├── data
├── dto
│   ├── request
│   └── response
├── entity
├── enums
├── repository
└── service
```

- `controller`: REST API entry points.
- `service`: Business workflow logic.
- `repository`: Database access interfaces.
- `entity`: Database-backed business objects.
- `dto`: API request and response shapes.
- `enums`: Controlled values such as user roles and claim statuses.
- `data`: MVP seed data for development.
- `config`: Future application configuration.

## Run Locally

Start PostgreSQL:

```bash
brew services start postgresql@16
```

Create the local database if it does not already exist:

```bash
createdb insurance_claims
```

The app expects PostgreSQL by default:

```text
DB_URL=jdbc:postgresql://localhost:5432/insurance_claims
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Run with:

```bash
./mvnw spring-boot:run
```

## Useful API Checks

```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/claims
curl http://localhost:8080/api/dashboard/summary
```

## MVP Note

Authentication and document upload are intentionally simple at this stage. The backend starts with seeded users and document metadata so the core claims workflow can be built first.
