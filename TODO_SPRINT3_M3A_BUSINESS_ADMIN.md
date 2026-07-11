# TODO — Sprint 3 / Milestone 3A: Business Administration Platform

## 0. Baseline inspection (completed in this branch)

- [x] Reviewed existing Business endpoints (`apps/api/src/business/*`).
- [x] Reviewed Prisma schema for current tenant/branch/roles_permissions/tenant_features.
- [x] Reviewed permission guard + role mapping (`apps/api/src/auth/*`, `apps/api/src/permissions/*`).
- [x] Reviewed Module Platform controller/service/state/permission stubs.

## 1. Database design + Prisma changes

- [ ] Extend Prisma schema for Sprint 3A entities:
  - [ ] Branding assets (logo/cover), contact/address, tax (GST/VAT)
  - [ ] Org hierarchy: departments, teams, designations
  - [ ] People: invitations, employee status
  - [ ] Permission groups / role templates / custom roles (as data model)
  - [ ] Module state reconciliation (installed/enable/disable/config)
- [ ] Create migration(s).

## 2. Backend: API + services

- [ ] Implement CRUD endpoints for:
  - [ ] Branch CRUD (if missing operations)
  - [ ] Departments
  - [ ] Teams
  - [ ] Designations
- [ ] Implement People/invitations:
  - [ ] Create invitation
  - [ ] List employees/managers/owners
  - [ ] Update employee status
- [ ] Implement Security management:
  - [ ] Role templates
  - [ ] Permission groups
  - [ ] Custom roles
  - [ ] Role assignment endpoints (reuse existing permissions module)
- [ ] Implement Business profile/branding/settings endpoints:
  - [ ] Branding (logo/cover + theme preset)
  - [ ] Tax information (GST/VAT)
  - [ ] Currency/timezone/language/theme
  - [ ] Business contact/address
- [ ] Implement Modules management (reuse Module Platform):
  - [ ] Installed modules list
  - [ ] Enable/disable
  - [ ] Configure
  - [ ] Updates
- [ ] Implement Settings endpoints:
  - [ ] Notification settings
  - [ ] Email/SMS/WhatsApp
  - [ ] AI settings
  - [ ] Marketplace settings
  - [ ] Consumer settings

## 3. Wiring / reuse rules

- [ ] Ensure no duplicate permission logic: reuse PermissionsGuard + RequirePermission.
- [ ] Ensure no duplicate module logic: route module endpoints to ModulePlatformService.
- [ ] Ensure tenant scoping uses existing TenantGuard conventions.

## 4. Frontend (Next.js)

- [ ] Add Business Admin pages + forms:
  - [ ] Business Profile / Branding
  - [ ] Organization (branches/departments/teams/designations)
  - [ ] People (invitations/employees/status)
  - [ ] Security (roles/permissions/groups/templates)
  - [ ] Modules (installed/enable/disable/config/update)
  - [ ] Settings (notifications/email/sms/whatsapp/AI/marketplace/consumer)
- [ ] Add API client calls in `apps/web/services/*` + types in `apps/web/types/*`.

## 5. Testing

- [ ] Add/extend backend tests for:
  - [ ] Business update
  - [ ] Branch CRUD
  - [ ] Employee invite
  - [ ] Role assignment
  - [ ] Permission validation
  - [ ] Module enable/disable
- [ ] Add/extend module-platform adapter tests.

## 6. Documentation

- [ ] Update docs:
  - [ ] Business Administration
  - [ ] Business Core
  - [ ] AI Context (if needed)
- [ ] Update sprint milestone documentation index.

## 7. Final verification

- [ ] Run lint/build/tests for api + web.
- [ ] Record build status.
