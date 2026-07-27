# Phase 29C — Production Environment Audit

This document is the verified source-of-truth registry of environment variables consumed by the platform core and industry services.

---

## 1. Application-Specific Environment Variables

| Variable Name | Required / Optional | Service | Secret? | Configured? | Validation Method |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Optional (default: `development`) | API / Web | No | Yes (Staging) | Check process logs |
| `PORT` | Optional (default: `3001`) | API / Web | No | Yes (Staging) | Check bound TCP ports |
| `LOG_LEVEL` | Optional (default: `info`) | API Gateway | No | Yes (Staging) | Check NestJS config |
| `DATABASE_URL` | Required | API / DB | Yes | Yes (Staging) | Verify pool connectivity |
| `REDIS_HOST` | Optional (default: `localhost`) | API / Cache | No | Yes (Staging) | Execute Redis ping |
| `REDIS_PORT` | Optional (default: `6379`) | API / Cache | No | Yes (Staging) | Execute Redis ping |
| `REDIS_PASSWORD`| Optional | API / Cache | Yes | No | Execute Redis ping |
| `JWT_SECRET` | Required | API / Auth | Yes | Yes (Staging) | Validate token decoding |
| `JWT_EXPIRATION`| Optional (default: `24h`) | API / Auth | No | Yes (Staging) | Validate token decoding |
| `AUTH_TOKEN_PEPPER`| Optional | API / Auth | Yes | Yes (Staging) | Validate passwords check |
| `SAAS_MASTER_ENCRYPTION_KEY`| Required | API / KMS | Yes | Yes (Staging) | Validate GCM envelope wraps |
| `SAAS_BLIND_INDEX_KEY`| Required | API / KMS | Yes | Yes (Staging) | Check normalized queries |
| `TWILIO_ACCOUNT_SID`| Optional | API / SMS | Yes | No | Trigger OTP request |
| `TWILIO_AUTH_TOKEN`| Optional | API / SMS | Yes | No | Trigger OTP request |
| `TWILIO_PHONE_NUMBER`| Optional | API / SMS | Yes | No | Trigger OTP request |
| `SENDGRID_API_KEY`| Optional | API / Mail | Yes | No | Send SMTP test email |
| `SENDER_EMAIL` | Required | API / Mail | No | Yes (Staging) | Send SMTP test email |
| `OPENAI_API_KEY`| Optional | API / AI | Yes | No | Prompt AI assistant |
| `STRIPE_SECRET_KEY`| Optional | API / Pay | Yes | No | Execute Stripe sandbox check |
| `STRIPE_WEBHOOK_SECRET`| Optional | API / Pay | Yes | No | Verify webhook request |
| `CLOUDINARY_CLOUD_NAME`| Optional | API / Upload | No | No | Check object upload |
| `CLOUDINARY_API_KEY`| Optional | API / Upload | Yes | No | Check object upload |
| `CLOUDINARY_API_SECRET`| Optional | API / Upload | Yes | No | Check object upload |
| `NEXT_PUBLIC_API_URL`| Required | Frontend | No | Yes (Staging) | Request health controllers |

---

## 2. AWS / KMS Credential Hardening

- **Security Target**: `SECURITY_HARDENING_REQUIRED`  
- **Hardening Policy**: Static `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are not configured in production settings. Staging and production instances must bind IAM Instance Profiles or Workload Identity provider accounts to query the AWS KMS registry.
