# Phase 29M — Deployment Contract Audit

This document registers the verified build and runtime commands of the monorepo packages.

---

## 1. Verified Process Commands

| Process Component | Build Command | Execution Command |
| :--- | :--- | :--- |
| **API Web Service** | `npm run build` | `npm run start:prod` (or `node dist/main`) |
| **Background Worker**| `npm run build` | `RUN_MODE=worker node dist/main` |
| **Web Service** | `npm run build` | `npm run start` (or `next start`) |
| **Prisma Generation**| `npx prisma generate` | — |
| **Prisma Deploy** | — | `npx prisma migrate deploy` |

---

## 2. Migration Execution Flow

Render supports a **Pre-Deploy Command** context for Web Services.
- **Controlled Execution**: Set the pre-deploy command on `ak-business-os-staging-api` to:
  ```bash
  npx prisma generate && npx prisma migrate deploy
  ```
- **Execution Mode**: Render guarantees this job completes successfully *before* traffic routing switches to the new container instance. This prevents multiple replica API containers from running migrations simultaneously.
- **Destructive Commands Block**: Command overrides like `migrate reset` or `db push` are strictly prohibited.
