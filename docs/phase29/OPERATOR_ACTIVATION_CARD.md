# Phase 29C — Operator Activation Card

This card outlines the remaining manual actions the platform operator must perform to enable external provider communications for the pilot.

---

## 1. Action Items Card

| Service | Required Configuration | Where to Configure | Verification Command / Action | Expected Result | Blocking? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Twilio SMS** | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Container Env Config | Request a client OTP login challenge | `MFA challenge code dispatched` | **No** (Simulated fallback active) |
| **SendGrid Mail**| `SENDGRID_API_KEY`, `SENDER_EMAIL` | Container Env Config | Trigger a test transaction checkout | SMTP delivery successfully logged | **No** (Simulated fallback active) |
| **Stripe Pay** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Container Env Config | Create payment intent checkout | `Stripe payment succeeded` | **No** (CASH fallback allowed) |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Container Env Config | Upload a document photo | Uploaded URL returned successfully | **Yes** (If uploads required) |
