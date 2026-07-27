# Phase 29G — Backup & Restore Operator Runbook

This runbook guides the operator through executing a non-destructive staging backup and recovery verification drill.

---

## 1. Execution Procedure

### Step A: Generate Encrypted Backup
1. Access the PG Staging instance via CLI or cloud management interface.
2. Execute backup command:
   ```bash
   pg_dump -h staging-db -U postgres -d akresto_staging -F c -b -v -f /tmp/staging_backup.dump
   ```
3. Record backup size, encryption tag validation, and timestamp.

### Step B: Restore to Isolated Target
1. Create a clean isolated database `akresto_recovery_test`.
2. Restore database from dump:
   ```bash
   pg_restore -h staging-db -U postgres -d akresto_recovery_test -v /tmp/staging_backup.dump
   ```
3. **Verification**: Run row-count queries on `Tenant`, `users`, and `orders` tables. Confirm key decrypts using test KMS keys.
