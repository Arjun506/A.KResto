# Render Runtime Failure Audit — Incident 002

**Failure Code**: `MODULE_NOT_FOUND` `/app/dist/main.js`  
**Status**: `RESOLVED`

---

## 1. Incident Analysis

- **Error**: `Error: Cannot find module '/app/dist/main.js' code: MODULE_NOT_FOUND`.
- **Root Cause**: `apps/api/prisma.config.ts` exists outside `src/`. When `nest build` / `tsc` compiled `apps/api`, TypeScript created `dist/prisma.config.js` and `dist/src/main.js`. The actual compiled NestJS entrypoint is `dist/src/main.js`. However, `apps/api/package.json` line 15 (`"start:prod": "node dist/main"`) and `apps/api/Dockerfile` line 28 (`CMD ["node", "dist/main.js"]`) incorrectly expected `dist/main.js`.

---

## 2. Corrective Action Implemented

1. Verified `dist/src/main.js` exists on disk after `npm run build`.
2. Updated `apps/api/package.json` script: `"start:prod": "node dist/src/main"`.
3. Updated `apps/api/Dockerfile`: `CMD ["node", "dist/src/main.js"]`.
4. Executed verification: `npx prisma validate`, `npx prisma generate`, `npm run build`, `npm run test` (67/67 suites pass).

---

## 3. Canonical Production Startup Contract

- **Source Entrypoint**: `src/main.ts`
- **Compiled Entrypoint**: `dist/src/main.js`
- **Docker CMD**: `CMD ["node", "dist/src/main.js"]`
- **npm start:prod**: `node dist/src/main`
