# Render Docker Build Failure Audit — Incident 001

**Failure Code**: `EUSAGE`  
**Location**: Stage `[deps 4/4] RUN npm ci` in `apps/api/Dockerfile`  
**Status**: `RESOLVED`

---

## 1. Failure Analysis

- **Error**: `npm error code EUSAGE: The npm ci command can only install with an existing package-lock.json or npm-shrinkwrap.json with lockfileVersion >= 1.`
- **Root Cause**: `apps/api/package.json` specifies standalone dependencies for NestJS API. When `apps/api/Dockerfile` executed `COPY package*.json ./`, it copied `apps/api/package.json`. However, `apps/api/package-lock.json` was uncommitted/absent, causing `npm ci` to fail immediately.

---

## 2. Corrective Action Implemented

1. Generated `apps/api/package-lock.json` via `npm install --package-lock-only --prefix "apps/api"`.
2. Verified `apps/api/package-lock.json` is committed and tracked in git.
3. Verified `COPY package*.json ./` in `apps/api/Dockerfile` now receives both `package.json` and `package-lock.json`.
4. Executed local verification: `npx prisma validate`, `npx prisma generate`, `npm run build`, `npm run test` (67/67 suites pass).

---

## 3. Render Configuration Contract

- **Root Directory**: `apps/api`
- **Docker Build Context Directory**: `apps/api`
- **Dockerfile Path**: `Dockerfile` (or `apps/api/Dockerfile`)
- **Health Check Path**: `/api/v1/health`
