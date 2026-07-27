# Phase 29H — Communication Provider Decision

This document details the optional and mandatory status classifications of SMS and Email integrations during the pilot.

---

## 1. Classification Matrix

- **SMS OTP Gateway**: `OPTIONAL_FOR_PILOT` (Staging/Sandbox verification allows manually resolving generated login codes via standard logs, which eliminates dependency on live SMS delivery).
- **Email Notifications**: `OPTIONAL_FOR_PILOT` (Invitation URLs can be securely copied from the Super Admin pilots dashboard and delivered manually).
- **Public Launch Requirement**: Both providers must transition to `LIVE_PROVIDER` mode and verify TLS/signature headers before general availability.
