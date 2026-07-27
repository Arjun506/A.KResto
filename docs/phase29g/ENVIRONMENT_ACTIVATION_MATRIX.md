# Phase 29G — Environment Activation Matrix

This matrix tracks the configuration and validation status of required environment variables.

---

## 1. Variable Registry

| Variable Name | Required | Purpose | Configured? | Validated? | Secret? | Operator Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | Database connection | `CONFIGURED`| Yes | Yes | None (Auto-injected) |
| `REDIS_HOST` | Yes | BullMQ / Cache | `CONFIGURED`| Yes | No | None (Auto-injected) |
| `REDIS_PORT` | Yes | BullMQ / Cache | `CONFIGURED`| Yes | No | None (Auto-injected) |
| `JWT_SECRET` | Yes | Session JWT tokens | `CONFIGURED`| Yes | Yes | None (Auto-injected) |
| `SAAS_MASTER_ENCRYPTION_KEY`| Yes | KMS envelope key | `CONFIGURED`| Yes | Yes | None (Auto-injected) |
| `SAAS_BLIND_INDEX_KEY`| Yes | Query normalizations| `CONFIGURED`| Yes | Yes | None (Auto-injected) |
| `NEXT_PUBLIC_API_URL`| Yes | Frontend gateway URL| `CONFIGURED`| Yes | No | None (Auto-injected) |
| `STRIPE_SECRET_KEY`| No | Payment Gateway | `MISSING` | No | Yes | Inject sandbox API keys |
| `TWILIO_ACCOUNT_SID`| No | SMS OTP gateway | `MISSING` | No | Yes | Inject Twilio auth tokens |
| `SENDGRID_API_KEY` | No | Email notification | `MISSING` | No | Yes | Inject SendGrid API keys |
