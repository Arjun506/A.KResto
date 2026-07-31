# Phase 32B — Render API Deployment Contract

**Contract Status**: `CERTIFIED`

---

## 1. Monorepo Root & Workspace Strategy

- **Runtime Strategy**: **Docker** using `apps/api/Dockerfile`.
- **Lockfile Strategy**: `apps/api/package-lock.json` committed and validated.
- **Root Directory**: `apps/api`
- **Docker Build Context Directory**: `apps/api`
- **Dockerfile Path**: `Dockerfile` (or `apps/api/Dockerfile`)
- **Install Command**: Handled inside Dockerfile `RUN npm ci`
- **Build Command**: Handled inside Dockerfile `RUN npm run build`
- **Start Command**: `node dist/main.js` (Dockerfile `CMD ["node", "dist/main.js"]`)

---

## 2. Environment & Network Binding

- **Port Binding**: `PASS` (Reads `process.env.PORT`)
- **Host Binding**: `PASS` (Binds explicitly to `0.0.0.0`)
- **Health Check Path**: `/api/v1/health`
