# TEST COVERAGE MATRIX v1 (Business OS V2.0 - Phase 1)

**Scope:** Existing architecture only. No redesign, no duplicate APIs/pages/services.
**Goal:** Discovery inventory + initial test classification based on what exists in-repo.

> **Legend**
>
> - Unit Test: ✅ Implemented / ⚠️ Partial / ❌ Missing / N/A
> - API/E2E: ✅ Implemented / ⚠️ Partial / ❌ Missing / N/A
> - UI/Workflow/Security/Performance/Regression: ✅/⚠️/❌/N/A

---

## 1) Test Infrastructure Inventory (Discovered)

### Backend (NestJS API)

- Jest unit tests: **Present**
  - `apps/api/test/unit/cloud.service.spec.ts` ✅ Implemented
  - `apps/api/test/unit/module-permission.service.spec.ts` ✅ Implemented
- Jest E2E tests: **Present (limited)**
  - `apps/api/test/app.e2e-spec.ts` ✅ Implemented (GET `/api/v1` only)
  - `apps/api/test/business.e2e-spec.ts` ✅/⚠️ Partial (basic business/public endpoints + workspace provisioning + auth requirement)
- Not discovered (v1 scan via listing): automated coverage for most controllers/services.

### Frontend (Next.js)

- UI test framework: **Not discovered**
  - `apps/web/package.json` contains build/dev/lint only; no Playwright/Cypress/Jest UI deps.

---

## 2) Backend Controller & Route Coverage (Key Artifacts)

### Auth

**Controller:** `apps/api/src/auth/auth.controller.ts`

- `POST /auth/register` — Unit ⚠️ (auth.service.spec exists; controller not unit-tested?) | API ❌ | E2E ❌
- `POST /auth/login` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/refresh` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/logout` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/forgot-password/request` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/forgot-password/verify` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/forgot-password/reset` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/verify-email/request` (guarded) — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/verify-email/confirm` — Unit ⚠️ | API ❌ | E2E ❌
- `POST /auth/2fa/verify` (guarded) — Unit ⚠️ | API ❌ | E2E ❌

**Guards/Permissions:**

- `JwtAuthGuard` (`apps/api/src/auth/jwt-auth.guard.ts`) — Unit N/A | API N/A | E2E ❌
- `PermissionsGuard` (`apps/api/src/auth/permissions.guard.ts`) — Unit ✅ Implemented (indirectly via module-permission tests; guard itself not explicitly unit-tested in v1)
- `TenantGuard` (`apps/api/src/tenant/tenant.guard.ts`) — Unit ❌ Missing | API ❌ | E2E ❌

---

### Business (Workspace provisioning etc.)

**E2E exists** (from `business.e2e-spec.ts`)

- `GET /business/industries` — E2E ✅ Implemented (basic assertions)
- `GET /business/currencies` — E2E ✅ Implemented
- `GET /business/timezones` — E2E ✅ Implemented
- `GET /business/check-name?name=` — E2E ✅ Implemented
- `POST /business/workspace` — E2E ✅ Implemented (success + duplicate cases)
- `GET /business/settings` — E2E ✅ Implemented (auth required => 401)

**Additional endpoints discovered via module listing**: not fully inspected in v1.

- Unit Test: ⚠️ Partial (business.service.spec exists)
- API/E2E: ⚠️ Partial (only a subset tested)

---

### Orders

**Controller:** `apps/api/src/orders/orders.controller.ts`

- `POST /orders` (RequirePermission `orders:write` / `pos:write`) — API ❌ | E2E ❌
- `GET /orders` (RequirePermission `orders:read` etc.) — API ❌ | E2E ❌
- `GET /orders/:id` — API ❌ | E2E ❌
- `POST /orders/:id/checkout` — API ❌ | E2E ❌
- `PATCH /orders/:id/status` — API ❌ | E2E ❌
- `DELETE /orders/:id` — API ❌ | E2E ❌

**Service:** `apps/api/src/orders/orders.service.ts`

- Unit: ⚠️ Partial (not discovered in v1)

---

### Inventory

**Controller:** `apps/api/src/inventory/inventory.controller.ts`

- CRUD on `items` + deductions
- low stock alerts
- movements
- menu item ingredient recipes
- supplier CRUD
- purchase order CRUD/status

Unit: ❌ Missing (no `inventory.*.spec.ts` discovered in v1)
API/E2E: ❌ Missing

---

### Menu

**Controller:** `apps/api/src/menu/menu.controller.ts`

- categories create/list/update/delete
- menu items create/list/get/update/availability/delete

Unit: ❌ Missing
API/E2E: ❌ Missing

---

### Notifications / Reservations / Restaurants / Payments / Uploads / Workforce / Subscription / Super-Admin / Cloud / Queue / Industry Packs / Module Platform / Product Capability

**Controllers exist** (discovered via directory listing in v1), but **route-by-route inspection not completed** in v1.

Classification (v1 default until further inspection):

- Unit Test: ⚠️ Partial (unknown; some `*.service.spec.ts` may exist)
- API/E2E: ❌ Missing

---

## 3) Tenant Isolation & Authorization Coverage

### TenantGuard + PermissionsGuard

- `TenantGuard`: Unit ❌ Missing | E2E ❌ Missing
- `PermissionsGuard`: Unit ⚠️ Partial (not explicitly unit-tested; permission mapping has its own unit tests)

**E2E:**

- One auth-protected negative test exists (`GET /business/settings` => 401)
- No explicit tenant isolation tests exist in v1.

---

## 4) UI / Workflow / Security / Performance / Regression Coverage

### UI Tests

- ❌ Missing (no framework discovered in `apps/web/package.json`)

### Workflow Tests

- ⚠️ Partial: workspace provisioning flow is partially covered by `business.e2e-spec.ts`.
- ❌ Missing: Restaurant registration, menu management, POS billing, kitchen workflow, ordering, inventory updates, payments, reservations, CRM, notifications, subscription, industry pack install, automation engine.

### Security Tests

- ⚠️ Partial: auth requirement (401) is present for one endpoint.
- ❌ Missing: RBAC enforcement matrix, tenant isolation bypass attempts, input validation boundary cases, SQLi/XSS/CSRF checks, audit-log assertions, file upload abuse tests.

### Performance Tests

- ❌ Missing

### Regression Tests

- ⚠️ Partial: existing E2E tests are a starting set.
- ❌ Missing: full suite that runs all discovered business endpoints.

---

## 5) Modules Tested (What is known to be covered in v1)

- Auth: ❌ Missing (routes not E2E-tested)
- Business Workspace provisioning: ✅ Implemented (subset)
- CloudService: ✅ Implemented (unit)
- ModulePermissionService: ✅ Implemented (unit)
- AppController: ✅ Implemented (GET /api/v1)

---

## 6) Coverage Percentage Estimate (v1)

**Known tested artifacts:**

- 4 spec files exist (2 e2e + 2 unit).

**Estimated coverage:**

- API endpoints: **Low single-digit to low teens** (not enough endpoints validated).
- Workflows: **Partial (workspace provisioning only)**.

---

## 7) Recommended Next Test Additions (No code changes yet)

### High priority (Security/Auth/Tenant Isolation)

1. E2E: `AuthController` endpoints (register/login/refresh/logout + guarded endpoints)
2. E2E: RBAC enforcement for `OrdersController`, `MenuController`, `InventoryController`
3. E2E: TenantGuard/PermissionsGuard negative cases

### High priority (Core business)

4. E2E: Orders CRUD + checkout + status transitions
5. E2E: Menu categories/items + availability transitions
6. E2E: Inventory items + stock deduction + low stock alert

### Workflow automation

7. End-to-end workflow: workspace provisioning -> auth -> create menu -> create order -> checkout -> kitchen status -> inventory deduction -> notifications (as applicable)

---

## 8) Notes / Gaps

- Ripgrep not available, so full repo enumeration relied on `list_files` and targeted reads.
- v1 matrix is **incremental**: more controllers/routes will be inspected and updated in next matrix iteration.
