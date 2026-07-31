# Render Runtime Failure Audit — Incident 004

**Failure Code**: `POST_ROUTE_REGISTRATION_PROCESS_EXIT`  
**Status**: `RESOLVED`

---

## 1. Incident Analysis & Root Cause

- **Observed Behavior**: The NestJS application booted, registered all HTTP controllers/routes, logged `Mapped {/api/v1/saas/usage/record, POST} route`, and then terminated ~20 seconds later with `==> Exited with status 1`.
- **Root Cause Identified**: Over 30 feature modules in `apps/api/src` declared `PrismaService` in their own local `providers: [...]` array without a shared `@Global()` `PrismaModule`. NestJS created separate, standalone instances of `PrismaService` for each feature module. During `NestApplication.init()`, over 15 separate `PrismaService` instances executed `onModuleInit()` -> `await this.$connect()` in parallel. This breached the Supabase PostgreSQL session-mode pool limit (`EMAXCONNSESSION max clients reached in session mode - max clients are limited to pool_size: 15`). Because database connection failed during NestJS lifecycle initialization before `app.listen()` could open the port, Render's 20-second startup health check timer expired and killed the process with status 1.

---

## 2. Corrective Action Implemented

1. **Global PrismaModule Architecture**: Created `@Global()` `PrismaModule` in `apps/api/src/prisma/prisma.module.ts` and registered it in `AppModule`.
2. **Provider Cleanup**: Removed redundant `PrismaService` provider entries across 31 feature modules in `apps/api/src`, enforcing a single singleton instance of `PrismaService` for the entire process.
3. **Lifecycle Logging**: Added structured lifecycle stage logs (`BOOTSTRAP_STAGE_01` through `BOOTSTRAP_STAGE_06_LISTEN_SUCCESS`) to `main.ts` and `PrismaService`.
4. **Local Production Boot Verification**:
   - `LISTEN_SUCCESS` reached on `http://0.0.0.0:3001/api/v1` in 0.5s with exactly 1 Prisma DB connection.
   - `GET /api/v1/health` returned `200 OK` (`status: "ok"`).
   - `GET /api/v1/ready` returned `200 OK` (`status: "ready"`, `database: "UP"`).
   - Unit test suite: 67/67 suites passed (124 tests).

---

## 3. Verification Matrix

- **LISTEN_REACHED**: `YES`
- **SINGLE_PRISMA_INSTANCE**: `YES`
- **HEALTH_ENDPOINT**: `PASS` (`GET /api/v1/health`)
- **READINESS_ENDPOINT**: `PASS` (`GET /api/v1/ready`)
- **SAFE_TO_REDEPLOY**: `YES`
