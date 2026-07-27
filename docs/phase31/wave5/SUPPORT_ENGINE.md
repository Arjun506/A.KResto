# Phase 31 Wave 5 — Support Engine

---

## Universal Support Ticket Management

- **Support Ticket Engine**: `src/crm-foundation/support-tickets/support-tickets.service.ts` provides ticket creation, assignment, comment thread, and status tracking.
- **Lifecycle**: `OPEN ➔ IN_PROGRESS ➔ WAITING_USER ➔ RESOLVED ➔ CLOSED`.
- **Authorization**: Customers view own tickets; staff view tenant-scoped tickets; platform super-admin access remains isolated.
