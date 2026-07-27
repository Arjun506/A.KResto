# Phase 32 — Deployment Reality Audit

---

## Render Deployment Specifications

- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`
- **Root Directory**: `apps/api`
- **Run Mode**: `RUN_MODE=api`
- **Health Endpoints**:
  - Liveness: `GET /api/v1/health`
  - Readiness: `GET /api/v1/ready`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `RUN_MODE`: `api`
  - `DATABASE_URL`: `postgresql://...` (Configured via Render dashboard)
  - `REDIS_HOST`: `crisp-lemming-174820.upstash.io`
  - `REDIS_PORT`: `6739`
  - `REDIS_TLS`: `true`
  - `JWT_SECRET`: (Configured via Render dashboard)
  - `SENDER_EMAIL`: (Configured via Render dashboard)
  - `NEXT_PUBLIC_API_URL`: (Render API service URL)
