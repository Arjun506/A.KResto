# Phase 27 — External Dependency Matrix

This document maps all external provider configurations, SMS gateway targets, payment endpoints, mapping coordinates, and AI APIs.

---

## 1. Third-Party Integrations

| Dependency | Purpose | Target Provider | Launch Status |
| :--- | :--- | :--- | :--- |
| **KMS / Keys** | Envelope crypt wrapping | AWS KMS / Local | `READY` |
| **SMS / OTP** | Signup verify & MFA challenge | Twilio API | `CONFIG_REQUIRED` |
| **Email Delivery**| Invoices & booking alters | SendGrid SMTP | `CONFIG_REQUIRED` |
| **Payments** | Credit card checkout transactions | Stripe Gateway | `READY` |
| **GIS / Maps** | Real-time vehicle coordinates | Leaflet/OSM | `READY` |
| **AI Prompting** | Insights & recommendations | OpenAI / Anthropic | `READY` |

---

## 2. Sandbox Constraints

- No real payment transactions or live charges will execute without explicit operator authorization tokens.
- All email/SMS gateways will log output arrays in Sandbox configurations to prevent accidental customer spamming.
