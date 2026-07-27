# Phase 32A — Render API Environment Variable Matrix

---

## 1. REQUIRED API ENVIRONMENT VARIABLES (`REQUIRED_API_ENV_NAMES`)

| Variable Name | Purpose | Staging Value / Source |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `RUN_MODE` | Runtime component isolation | `api` |
| `DATABASE_URL` | Supabase PostgreSQL Connection | Existing Supabase Staging DB |
| `REDIS_HOST` | Upstash Redis Host | `crisp-lemming-174820.upstash.io` |
| `REDIS_PORT` | Upstash Redis Port | `6739` |
| `REDIS_PASSWORD` | Upstash Redis Auth Password | Existing Upstash Password |
| `REDIS_TLS` | Upstash Redis Security | `true` |
| `JWT_SECRET` | Authentication Token Signing | Existing Staging JWT Secret |
| `SENDER_EMAIL` | Transactional Email Sender | Secure Staging Email Address |
| `NEXT_PUBLIC_API_URL` | Application API Origin | Render Public Web Service URL |

---

## 2. OPTIONAL API ENVIRONMENT VARIABLES (`OPTIONAL_API_ENV_NAMES`)

- `PORT` (Assigned dynamically by Render)
- `LOG_LEVEL` (`info`)
- `THROTTLE_TTL` (`60000`)
- `THROTTLE_LIMIT` (`20`)
- `SAAS_MASTER_ENCRYPTION_KEY` (KMS master key fallback active if omitted)
- `SAAS_BLIND_INDEX_KEY` (Blind index hash key fallback active if omitted)
- `STRIPE_SECRET_KEY` (Sandbox mode key)
- `STRIPE_WEBHOOK_SECRET` (Sandbox webhook secret)
- `SENDGRID_API_KEY` (Simulated provider active if omitted)
- `TWILIO_ACCOUNT_SID` (Simulated provider active if omitted)

---

## 3. FRONTEND ONLY & WORKER ONLY VARIABLES

- **FRONTEND_ONLY_ENV_NAMES**: None (API does not require frontend-only client secrets)
- **WORKER_ONLY_ENV_NAMES**: `RUN_MODE=worker` (Configured separately on Render Worker service)
