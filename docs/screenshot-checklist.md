# Screenshot Checklist

Use one consistent desktop browser size for the main portfolio images. A 1440px wide viewport works well for showing the sidebar, page header, and content area together.

## 1. Main Portal View

Capture the app immediately after launch on the Claimant/User role.

This proves:
- The app has a polished enterprise portal shell.
- Role switching is visible but intentionally simple for the MVP.
- Navigation is organized by claimant and admin workflows.

## 2. Claimant Submit Claim Form

Capture the Submit Claim screen before entering data.

This proves:
- The claimant intake workflow is structured.
- The form uses clear required fields.
- Material UI form controls are used consistently.

## 3. Claimant Claims List

Capture the My Claims screen with at least one seeded or submitted claim visible.

This proves:
- Claimants can view submitted claims.
- Status, incident date, and claim number are easy to scan.
- The same data returned by the backend is visible in the frontend.

## 4. Claimant Claim Detail

Capture the Claim Details screen with claim description, status, supporting documents, and claim history visible.

This proves:
- Claimants can inspect an individual claim.
- Status tracking is connected to the live backend.
- Supporting document metadata and audit history are part of the workflow.

## 5. Admin Dashboard

Switch to Admin/Reviewer and capture the Admin Dashboard.

This proves:
- Admin users have an operational summary view.
- The app supports claims visibility beyond individual records.
- Dashboard cards communicate basic claims operations metrics.

## 6. Admin Claims Review Table

Capture the Claims Review Table screen.

This proves:
- Admin users can review submitted claims in a table format.
- Search, status chips, claimant name, and open actions are visible.
- The UI matches a common enterprise review workflow.

## 7. Admin Claim Detail / Status Update

Capture the Admin Claim Detail screen before submitting a status update.

This proves:
- Reviewers can inspect claim context before changing status.
- The current status and next status control are visible.
- Reviewer notes are part of the administrative workflow.

## 8. Claim History / Audit Trail Close-Up

Capture the Claim History section on either Claim Details or Admin Claim Detail.

This proves:
- Status changes create traceable history records.
- The app demonstrates auditability, a key enterprise system concept.
- Reviewer notes and changed-by information are visible.

## 9. Supporting Documents Close-Up

Capture the Supporting Documents section with `repair-estimate.pdf` visible.

This proves:
- The MVP models document tracking without overbuilding file storage.
- Document name, type, upload date, and mock URL are visible.
- The project intentionally separates metadata tracking from real upload infrastructure.

## 10. README / GitHub Repo Preview

Capture the GitHub repository landing page with the README visible near the top.

This proves:
- The project is packaged professionally.
- The tech stack, business purpose, and MVP limitations are easy to understand.
- A recruiter or hiring manager can quickly understand the project story.

## Capture Notes

- Use the same browser size for all app screenshots.
- Wait a moment after clicking navigation so focus/ripple states disappear.
- Avoid browser chrome clutter, unrelated tabs, bookmarks, or notifications.
- Prefer screenshots with real seeded data instead of empty screens.
- Keep one optional empty-state screenshot only if you want to show thoughtful UX handling.
- Do not add JWT, file upload, cloud storage, or new workflows just for screenshots.
