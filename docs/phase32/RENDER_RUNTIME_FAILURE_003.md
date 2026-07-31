# Render Runtime Failure Audit — Incident 003

**Failure Code**: `OPAQUE_ERROR_SERIALIZATION` `{"level":"ERROR","message":{}}`  
**Status**: `RESOLVED`

---

## 1. Incident Analysis & Root Cause

- **Opaque Logging Cause**: `JsonLogger` (in `apps/api/src/common/logger/json-logger.service.ts`) checked `typeof message !== 'string'` and returned the `message` object directly. JavaScript `Error` instances (such as `PrismaClientInitializationError`) have non-enumerable properties (`message`, `name`, `stack`). When `JSON.stringify(payload)` ran, `JSON.stringify` converted the `Error` object into `{}`!
- **Startup Failure Cause**: When `PrismaService.onModuleInit()` failed to establish a PostgreSQL connection (due to Supabase session pooler connection limit `EMAXCONNSESSION` or invalid `DATABASE_URL` credentials in Render), NestJS caught the initialization exception and passed it to `logger.error()`, which logged `{"level":"ERROR","message":{}}` and exited status 1.
- **`NODE_ENV` Misconfiguration**: Render log displayed `"environment":"NODE_ENV"`, indicating the operator configured the Render environment variable `NODE_ENV` with the literal text value `"NODE_ENV"` instead of `"production"`.

---

## 2. Corrective Action Implemented

1. **Error Serialization Fix**: Added `formatValue()` helper to `JsonLogger` (`apps/api/src/common/logger/json-logger.service.ts`) to extract `name`, `message`, `stack`, and `trace` properties from `Error` objects while maintaining secret redaction.
2. **Top-Level Bootstrap Catch**: Updated `apps/api/src/main.ts` to attach `.catch((err) => ...)` to `bootstrap()` to log top-level unhandled promise rejections cleanly before non-zero exit.
3. Executed verification: `npx prisma validate`, `npx prisma generate`, `npm run build`, `npm run test` (67/67 suites pass).

---

## 3. Operator Instructions Required

- **Render Environment Variable Check**: Ensure `NODE_ENV` in Render Dashboard is set to `production` (not the literal string `"NODE_ENV"`).
- **Supabase DATABASE_URL Check**: Ensure `DATABASE_URL` uses the pooled connection string on port `6543` (Transaction Mode) or `5432` with adequate pool size.
