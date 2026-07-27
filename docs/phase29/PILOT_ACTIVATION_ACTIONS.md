# Phase 29 — Pilot Activation Actions

This document registers all manual configuration actions required from the platform owner/operator to activate production integrations.

---

## 1. Action Items Matrix

| Action | Provider/System | Required By | Environment | Status | Validation Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inject Stripe Keys** | Stripe | Payment Gateway | Production | `MANUAL_ACTION_REQUIRED` | Execute $1 Sandbox Auth request |
| **Inject SMS Keys** | Twilio | MFA/OTP SMS delivery| Production | `MANUAL_ACTION_REQUIRED` | Trigger mock MFA OTP challenge |
| **Configure SMTP** | SendGrid | Email Notifications | Production | `MANUAL_ACTION_REQUIRED` | Dispatch test billing receipt email |
| **AWS KMS Activation** | AWS KMS | Envelope crypt | Production | `MANUAL_ACTION_REQUIRED` | Decrypt verification sample |
| **DNS mapping** | Cloudflare | Routing console | Production | `MANUAL_ACTION_REQUIRED` | Dig target CNAME records |

---

## 2. Security Restrictions

- Under no circumstances should raw API secrets, database passwords, or master KMS wrapping keys be committed to public repository branches.
