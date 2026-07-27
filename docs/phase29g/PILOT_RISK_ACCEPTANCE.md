# Phase 29G — Pilot Risk Acceptance Matrix

This matrix documents accepted risks, mitigations, and review targets for the controlled pilot phase.

---

## 1. Risk Acceptance Registry

| Risk Description | Operational Impact | Mitigation Plan | Owner | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Stripe Sandbox mode** | Real payments cannot be processed | Use CASH or simulated card checkouts | Operator | `PENDING_OPERATOR_ACCEPTANCE` |
| **Email/SMS Sandbox** | Invites and OTPs require manual retrieval | Manually verify codes via logs | Operator | `PENDING_OPERATOR_ACCEPTANCE` |
| **Restore Drill Pending**| Recovery duration uncertified | Daily staging db backups active | Operator | `PENDING_OPERATOR_ACCEPTANCE` |
