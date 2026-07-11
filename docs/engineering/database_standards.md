# Engineering Standard: Database Standards

## 1. Schema Conventions

- **Table Names:** snake_case and plural (e.g. `business_entities`, `tenant_features`).
- **Keys:** Primary keys must use `cuid` values or auto-incrementing integers. Foreign keys must suffix referencing tables with `_id` (e.g. `tenant_id`).
- **Standard Columns:** Every table must include `created_at` (timestamp), `updated_at` (timestamp), and `deleted_at` (nullable timestamp for soft deletes).

## 2. Multi-Tenant Constraints

- Every table containing tenant-specific records must have a `tenant_id` column.
- Define composite indexes on `(tenant_id, id)` to speed up multi-tenant queries.
- Do not define cascading deletes across major capability modules to protect against accidental data loss.

## 3. Migration Guidelines

- Run all schema migrations through Prisma Migrate (`npx prisma migrate dev`).
- Always run pre-migration checks before dropping database columns.
- Ensure SQL migrations contain fallback statements to rollback changes if validation fails.
