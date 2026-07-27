# Phase 32A — Render API Deployment Contract

**Contract Status**: `CERTIFIED`

---

## 1. Monorepo Root & Workspace Strategy

- **Runtime Strategy**: **Docker** using `apps/api/Dockerfile` (Option B).
- **Justification**: `apps/api/Dockerfile` provides a self-contained, reproducible Node 22 Alpine environment that handles dependency installation (`npm ci`), Prisma generation (`npx prisma generate`), NestJS compilation (`npm run build`), and production pruning (`npm prune --production`). Running as non-root `node` user complies with Zero-Trust security rules.
- **Root Directory**: `apps/api`
- **Install Command**: (Handled inside Dockerfile `RUN npm ci`)
- **Build Command**: (Handled inside Dockerfile `RUN npm run build`)
- **Start Command**: `node dist/main.js` (or Render Docker CMD)

---

## 2. Environment & Network Binding

- **Port Binding**: `PORT_BINDING = PASS` (Reads dynamic `process.env.PORT`)
- **Host Binding**: `HOST_BINDING = PASS` (Explicitly binds to `0.0.0.0`)
- **Global API Prefix**: `/api/v1`
- **Liveness Endpoint**: `GET /api/v1/health`
- **Readiness Endpoint**: `GET /api/v1/ready`
- **Render Health Check Path**: `/api/v1/health`

---

## 3. Database Migration Strategy

- **Command**: `npx prisma migrate deploy`
- **Execution Location**: Executed against existing Supabase staging database prior to or during service boot.
- **Rules**: `prisma db push` and `prisma migrate reset` are strictly prohibited on staging.
