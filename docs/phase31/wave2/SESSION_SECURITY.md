# Phase 31 Wave 2 — Session Security Specifications

---

## Active Session & Step-Up MFA Security

- **Step-Up Authentication**: `StepUpAuthGuard` requires MFA verification for high-risk operations (role changes, refunds, subscription updates).
- **Session Revocation**: Active sessions recorded in Redis/DB with device metadata allowing remote session termination.
