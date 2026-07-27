# Phase 29L — Database Migration Evidence

**Supabase Staging Connection**: `NOT_VERIFIED`  

---

## 1. Migration Execution

1. Operator must inject direct direct-connection Supabase URL.
2. Run deployment migration command in builder container:
   ```bash
   npx prisma migrate deploy
   ```
3. Record applied migration IDs. Destructive `migrate reset` or `db push` commands are strictly blocked.
