# Phase 31 Wave 7 — Data Integrity Certification

---

## Database Integrity & Safety Audit

- **Foreign Keys & Constraints**: All relational tables explicitly enforce foreign key constraints (`tenantId`, `locationId`, `userId`, `orderId`).
- **Prisma Schema Validation**: Clean schema check with `npx prisma validate`.
- **Zero Raw Data Push**: Staging environments use structured migrations (`npx prisma migrate deploy`), avoiding `prisma db push`.
