# UI Screens

## Purpose

This document defines the core frontend screens for the Insurance Claims Management Portal MVP.

The UI should feel like a clean enterprise portal: clear navigation, predictable forms, useful tables, and visible status information. Material UI is a good fit because it provides familiar components for admin workflows.

## Submit Claim

### Purpose

Allows a claimant to submit a new insurance claim.

### Primary User

Claimant/User

### Core Components

- Claim type selector
- Incident date input
- Claim description field
- Optional document metadata section
- Submit button
- Validation messages
- Success confirmation

### Required Data

- Active claimant user
- Claim type options
- Form values

### User Actions

- Enter claim details
- Add optional document information
- Submit claim
- See confirmation with claim number

### Material UI Components That May Fit

- `Container`
- `Paper`
- `TextField`
- `Select`
- `MenuItem`
- `DatePicker`
- `Button`
- `Alert`
- `FormHelperText`

## My Claims

### Purpose

Allows a claimant to view their submitted claims and current statuses.

### Primary User

Claimant/User

### Core Components

- Claims list or table
- Status chips
- Claim number
- Claim type
- Submitted date
- Link to claim details

### Required Data

- Claims filtered by current claimant

### User Actions

- Review all personal claims
- Scan claim status
- Open a claim detail page

### Material UI Components That May Fit

- `Table`
- `TableRow`
- `TableCell`
- `Chip`
- `Button`
- `Card`
- `Stack`

## Claim Details

### Purpose

Shows a claimant the details, documents, and history for one claim.

### Primary User

Claimant/User

### Core Components

- Claim summary
- Current status chip
- Claim details section
- Document list
- Claim history timeline
- Add document metadata form or button

### Required Data

- Claim detail
- Related documents
- Claim history

### User Actions

- View claim information
- View status history
- Add supporting document metadata
- Return to My Claims

### Material UI Components That May Fit

- `Typography`
- `Chip`
- `Divider`
- `List`
- `ListItem`
- `Timeline` from MUI Lab, or a simple `List`
- `Button`
- `Dialog`

## Admin Dashboard

### Purpose

Gives admins a high-level operational summary of claim activity.

### Primary User

Admin/Claims Reviewer

### Core Components

- KPI summary cards
- Claims by status
- Link to review table
- Recent claims preview

### Required Data

- Dashboard summary counts
- Recent claims list if included

### User Actions

- Review operational volume
- Identify claims needing review
- Navigate to claims review table

### Material UI Components That May Fit

- `Grid`
- `Card`
- `CardContent`
- `Typography`
- `Chip`
- `Button`
- `LinearProgress`

## Claims Review Table

### Purpose

Allows admins to search, filter, and review submitted claims.

### Primary User

Admin/Claims Reviewer

### Core Components

- Search bar
- Status filter
- Claims table
- Status chips
- Claimant name
- Submitted date
- Review action button

### Required Data

- All claims
- Optional status filter
- Optional search query

### User Actions

- Search claims
- Filter by status
- Sort or scan claim list
- Open admin claim detail page

### Material UI Components That May Fit

- `TextField`
- `Select`
- `MenuItem`
- `Table`
- `TableHead`
- `TableBody`
- `TablePagination`
- `Chip`
- `IconButton`

## Admin Claim Detail / Update Status

### Purpose

Allows an admin to review a claim, inspect supporting information, and update claim status.

### Primary User

Admin/Claims Reviewer

### Core Components

- Claim detail summary
- Claimant information
- Document list
- Claim history timeline
- Status update form
- Admin note field
- Save/update button

### Required Data

- Claim detail
- Claimant details
- Documents
- Claim history
- Status options
- Active admin user

### User Actions

- Review claim information
- Review supporting document metadata
- Select a new status
- Add a status update note
- Save status update
- Confirm history was updated

### Material UI Components That May Fit

- `Grid`
- `Paper`
- `Chip`
- `Select`
- `MenuItem`
- `TextField`
- `Button`
- `Alert`
- `Divider`
- `List`

## Navigation Notes

Recommended simple MVP navigation:

- Claimant view: Submit Claim, My Claims
- Admin view: Dashboard, Review Claims
- Development-only role switcher: Claimant / Admin

Avoid a complex sidebar, profile menu, notification center, or full account settings area until the main workflow is complete.

## UI Scope Boundaries

Out of scope for the MVP:

- Complex file upload UI
- Payment screens
- Policy management screens
- Multi-step claim wizard
- Real-time notifications
- Advanced analytics dashboards
- Full user account management
