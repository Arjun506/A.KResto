# Phase 29B — External Provider Mode Matrix

This matrix registers the active integration profiles for all third-party dependencies.

---

## 1. Provider Mode Classifications

| Provider | Target Mode | Staging Status | Launch Status | Gaps / Gating Actions |
| :--- | :--- | :--- | :--- | :--- |
| **Stripe** | `SANDBOX` | `VERIFIED` | `SANDBOX` | Live payments are disabled |
| **Twilio** | `SANDBOX` | `VERIFIED` | `SANDBOX` | SMS OTP sending is simulated |
| **SendGrid** | `SANDBOX` | `VERIFIED` | `SANDBOX` | Email notifications simulated |
| **AWS KMS** | `TEST` | `VERIFIED` | `LIVE` | KMS key identifier required |
| **S3 Storage** | `TEST` | `VERIFIED` | `LIVE` | S3 bucket configurations required |
| **OpenAI** | `TEST` | `VERIFIED` | `LIVE` | API token quota ceilings configured |
| **Leaflet OSM**| `LIVE` | `VERIFIED` | `LIVE` | OSM route rendering active |
