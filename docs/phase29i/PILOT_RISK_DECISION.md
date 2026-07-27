# Phase 29I — Pilot Risk Decision Registry

This document lists active pilot operational risks and their mitigation statuses.

---

## 1. Risk Decision Registry

| Risk Description | Pilot Impact | Mitigation | Required for Pilot? | Recommended Decision | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SMS simulated** | Registration OTP requires manual check | Read generated OTP directly from stdout logs | No | Accept | `PENDING_OPERATOR_ACCEPTANCE` |
| **Email simulated** | Invitation url requires manual send | Copy invitation link from Super Admin UI | No | Accept | `PENDING_OPERATOR_ACCEPTANCE` |
| **Stripe sandbox** | Credit cards payments simulated | Enable cash payment option for POS transactions | No | Accept | `PENDING_OPERATOR_ACCEPTANCE` |
| **Backup drill pending**| Staging recovery duration uncertified| Perform snapshot backups before onboarding owner | No | Accept | `PENDING_OPERATOR_ACCEPTANCE` |
