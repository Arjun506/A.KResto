# Phase 29K — Supabase & Prisma Deployment

This document registers the database migration validation and execution strategy.

---

## 1. Migration Execution Flow

- **Direct Connections**: Used solely during build/deployment phase to execute migrations:
  ```bash
  npx prisma migrate deploy
  ```
- **Pooled Connections**: Application runtime uses pooled connection limits to prevent socket exhaustion.
- **Direct DB Resets**: Command `prisma migrate reset` is strictly blocked in staging/production runtimes.
- **Execution Mode**: Runs once as an initialization job prior to booting API services.
