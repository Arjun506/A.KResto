# Phase 32A.1 — Render API Environment Variable Matrix

---

## 1. REQUIRED API ENVIRONMENT VARIABLES (`REQUIRED_API_ENV_NAMES`)

- `NODE_ENV` (`production`)
- `RUN_MODE` (`api`)
- `DATABASE_URL` (Supabase PostgreSQL pooled connection URI)
- `REDIS_HOST` (`crisp-lemming-174820.upstash.io`)
- `REDIS_PORT` (`6739`)
- `REDIS_PASSWORD` (Upstash Redis auth password)
- `REDIS_TLS` (`true`)
- `JWT_SECRET` (JWT signing secret key)
- `SAAS_MASTER_ENCRYPTION_KEY` (KMS Master Encryption Key for tenant DEK wrapping)
- `SAAS_BLIND_INDEX_KEY` (HMAC key for blind searchable hashes)

---

## 2. OPTIONAL API ENVIRONMENT VARIABLES (`OPTIONAL_API_ENV_NAMES`)

- `SENDER_EMAIL` (Transactional sender email address)
- `LOG_LEVEL` (`info`)
- `THROTTLE_TTL` (`60000`)
- `THROTTLE_LIMIT` (`20`)

---

## 3. FRONTEND ONLY VARIABLES (`FRONTEND_ONLY_ENV_NAMES`)

- `NEXT_PUBLIC_API_URL` (Consumed only by `apps/web` Next.js frontend, NOT by NestJS API)

---

## 4. WORKER REQUIRED VARIABLES (`WORKER_REQUIRED_ENV_NAMES`)

- `RUN_MODE=worker` (Configured on Render Worker service)
- `DATABASE_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `REDIS_TLS`

---

## 5. PROVIDER OPTIONAL VARIABLES (`PROVIDER_OPTIONAL_ENV_NAMES`)

- `STRIPE_SECRET_KEY` (Sandbox payment key)
- `STRIPE_WEBHOOK_SECRET` (Sandbox payment webhook secret)
- `SENDGRID_API_KEY` (Simulated email active if omitted)
- `TWILIO_ACCOUNT_SID` (Simulated SMS active if omitted)
- `TWILIO_AUTH_TOKEN` (Simulated SMS active if omitted)
- `TWILIO_PHONE_NUMBER` (Simulated SMS active if omitted)
- `OPENAI_API_KEY` (AI platform key)
- `OPENAI_MODEL` (`gpt-4-turbo`)
- `SENTRY_DSN` (Error tracking)

---

## 6. RENDER MANAGED VARIABLES (`RENDER_MANAGED_ENV_NAMES`)

- `PORT` (Assigned dynamically by Render container runtime)
