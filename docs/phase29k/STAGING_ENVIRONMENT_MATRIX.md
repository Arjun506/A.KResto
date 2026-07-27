# Phase 29K — Staging Environment Matrix

This matrix documents the environment variable names required by the applications.

---

## 1. Environment Variables Matrix

| Variable Name | Component | Staging Classification | Details |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | API | `REQUIRED` | Staging Supabase Postgres URL |
| `REDIS_HOST` | API | `REQUIRED` | Upstash Redis connection TCP hostname |
| `REDIS_PORT` | API | `REQUIRED` | Upstash Redis port (typically 6379 / 30000+ TLS) |
| `REDIS_PASSWORD` | API | `REQUIRED` | Upstash Redis AUTH password |
| `JWT_SECRET` | API | `REQUIRED` | Cryptographically random signature key |
| `SAAS_MASTER_ENCRYPTION_KEY`| API | `REQUIRED` | Staging envelope master encryption key |
| `SAAS_BLIND_INDEX_KEY`| API | `REQUIRED` | Staging hashing key for index query lookups |
| `NEXT_PUBLIC_API_URL`| Web | `GENERATED_BY_PROVIDER`| Render API service URL |
| `NEXT_PUBLIC_APP_URL`| Web | `GENERATED_BY_PROVIDER`| Render Frontend URL |
| `CORS_ALLOWED_ORIGINS`| API | `GENERATED_BY_PROVIDER`| Configures allowed origins |
| `CLOUDFLARE_R2_BUCKET`| API | `OPTIONAL` | R2 Bucket Name |
| `CLOUDFLARE_R2_ACCESS_KEY`| API | `OPTIONAL` | R2 credential token |
| `CLOUDFLARE_R2_SECRET_KEY`| API | `OPTIONAL` | R2 secret key |
| `STRIPE_SECRET_KEY`| API | `OPTIONAL` | Stripe Sandbox API keys |
| `STRIPE_WEBHOOK_SECRET`| API | `OPTIONAL` | Stripe Sandbox Webhook validation key |
| `TWILIO_ACCOUNT_SID`| API | `NOT_REQUIRED_FOR_PILOT` | (Simulated Sandbox is active) |
| `SENDGRID_API_KEY` | API | `NOT_REQUIRED_FOR_PILOT` | (Simulated Sandbox is active) |
