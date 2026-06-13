# User Roles

## Purpose

This MVP has two roles: `Claimant/User` and `Admin/Claims Reviewer`.

The goal is to model a simple enterprise claims workflow without overbuilding authentication, permissions, or organizational structure. For the MVP, roles can be handled through seeded users, mock role switching, or a simple role field on the user record.

## Claimant/User

### Purpose

The claimant is the person submitting an insurance claim and checking progress over time.

In the real world, this role represents a customer, policyholder, or internal user who needs a clear way to report a claim, provide documentation, and understand the current status.

### Permissions

- Submit a new claim
- View their own claims
- View details for their own claims
- View the status and history of their own claims
- Add supporting document metadata or mock document links to their own claims

### Core User Actions

- Fill out a claim submission form
- Review submitted claim information
- Check whether a claim is submitted, under review, approved, denied, or closed
- View a timeline of claim history
- Add simple supporting documentation details

### What They Should Not Be Able To Do In The MVP

- View other users' claims
- Change claim status
- Approve or deny claims
- Edit admin notes
- Access the admin dashboard
- Delete claims
- Manage users or roles

## Admin/Claims Reviewer

### Purpose

The admin is the claims reviewer responsible for reviewing submitted claims and updating their status.

In the real world, this role represents a claims adjuster, operations specialist, or back-office reviewer who manages claim workflow and keeps records accurate.

### Permissions

- View all submitted claims
- Search and filter claims
- View claim details
- Update claim status
- Add simple status update notes
- View claim history
- View dashboard summary metrics

### Core User Actions

- Review a list of claims
- Search for a claim by claimant name, claim number, status, or type
- Open a claim detail view
- Change claim status
- Add a note explaining the status change
- Review document metadata or mock document links
- Monitor basic dashboard counts

### What They Should Not Be Able To Do In The MVP

- Submit claims on behalf of users unless explicitly added later
- Delete claims
- Delete claim history
- Manage payments, reserves, or settlement amounts
- Perform complex fraud review workflows
- Manage advanced role permissions
- Access production-style audit, compliance, or legal workflows

## MVP Role Strategy

Authentication should stay simple during the MVP.

Recommended options:

- Seed one claimant user and one admin user in the database
- Use a frontend role switcher during development
- Store a simple `role` field on the `User` entity

Avoid full JWT authentication until the core workflow is working. Authentication matters, but building it too early can distract from the main portfolio goal: showing that a business process can be translated into a working enterprise-style system.

## Enterprise Relevance

Enterprise systems separate user permissions because different teams perform different business functions. A claimant needs self-service visibility. A claims reviewer needs workflow control. Keeping these roles separate shows an understanding of business process, operational risk, and system access boundaries.
