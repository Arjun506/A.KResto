# Phase 32A.1 — Render API Deployment Contract

**Contract Status**: `CERTIFIED`

---

## 1. Monorepo Root & Workspace Strategy

- **Runtime Strategy**: **Docker** using `apps/api/Dockerfile`.
- **Docker Context Validation**: `DOCKER_CONTEXT_GATE = PASS`. `apps/api` is a fully self-contained directory containing its own `package.json`, `prisma/schema.prisma`, `src/`, `tsconfig.json`, and dependencies.
- **Root Directory**: `apps/api`
- **Dockerfile Path**: `apps/api/Dockerfile`
- **Install Command**: Handled inside Dockerfile `RUN npm ci`
- **Build Command**: Handled inside Dockerfile `RUN npm run build`
- **Start Command**: `node dist/main.js` (Dockerfile `CMD ["node", "dist/main.js"]`)

---

## 2. Environment & Network Binding

- **Port Binding**: `PORT_BINDING = PASS` (Reads dynamic `process.env.PORT`)
- **Host Binding**: `HOST_BINDING = PASS` (Binds explicitly to `0.0.0.0`)
- **Global API Prefix**: `/api/v1`
- **Liveness Endpoint**: `GET /api/v1/health`
- **Readiness Endpoint**: `GET /api/v1/ready`
- **Render Health Check Path**: `/api/v1/health`

---

## 3. Cryptographic & Auth Security

- **KMS Fail-Closed**: `PASS` (`SAAS_MASTER_ENCRYPTION_KEY` and `SAAS_BLIND_INDEX_KEY` are mandatory when `NODE_ENV=production`)
- **JWT Fail-Closed**: `PASS` (`JWT_SECRET` is mandatory for startup)

---

## 4. Database Migration Strategy

- **Command**: `npx prisma migrate deploy`
- **Execution Location**: Executed against existing Supabase staging database prior to service launch.
