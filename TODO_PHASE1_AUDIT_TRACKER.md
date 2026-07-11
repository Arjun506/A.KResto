# TODO_PHASE1_AUDIT_TRACKER

## Goal

Complete Phase 1 repository audit and produce the completion matrix for AK Business OS v1.0.

## Completed (current)

- Read Prisma schema baseline models: Tenant/users/roles_permissions/audit_logs/subscriptions and core restaurant operations entities (menu/order/inventory/reservations).
- Verified Super Admin backend endpoints are scaffold-only (super-admin controller/service empty).
- Verified Super Admin guard exists and enforces `role === 'SUPER_ADMIN'`.
- Verified frontend Super Admin portal exists but appears largely UI/mock-driven (not backend API-first).

## Pending

### Repo enumeration

- [ ] Enumerate all backend controllers and record their routes.
- [ ] Enumerate frontend route entrypoints under `apps/web/app/*` and record which feature they represent.

### Module-by-module classification (completion matrix)

- [ ] Restaurant Operations (✅/🟡/❌)
- [ ] Product Catalog
- [ ] Order Processing
- [ ] Kitchen Display System
- [ ] POS & Billing
- [ ] Inventory
- [ ] Finance
- [ ] CRM
- [ ] Customer Platform (AK Connect)
- [ ] Reports
- [ ] Super Admin
- [ ] Production Readiness

### Audit requirements to satisfy

For every module classification, capture evidence for:

- Frontend pages/components
- Backend APIs/controllers/services
- Database models
- Permissions/guards
- Validation
- Audit logging hooks
- Responsive/loading/empty/error/a11y indicators

## Notes / Constraints

- `search_files` may fail if ripgrep is missing; use `list_files` + `read_file` for reliable scanning.
