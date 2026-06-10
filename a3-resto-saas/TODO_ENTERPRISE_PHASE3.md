# TODO_ENTERPRISE_PHASE3

## Step 1: Repository reconnaissance (module-by-module)

- [ ] Inspect staff module presence: `apps/api/src/staff/*` and related DTOs/services.
- [ ] Inspect security: current `main.ts`, throttling, helmet usage, auth guards, request logging.
- [ ] Inspect audit logging module/files.
- [ ] Inspect Swagger setup / response standards.
- [ ] Inspect Socket.IO realtime integration: `apps/api/src/gateways/orders.gateway.ts`, and web realtime consumer files.
- [ ] Inspect tenant guards/decorators: `apps/api/src/tenant/*` and any prisma helper patterns.

## Step 2: Multi-tenant + Prisma safety hardening

- [ ] Ensure _all_ orders/menu/inventory/reservations write operations include tenant constraints.
- [ ] Fix any unsafe Prisma calls missing `restaurantId` filtering.
- [ ] Standardize SUPER_ADMIN bypass semantics.

## Step 3: Orders module completion (production-grade)

- [ ] Verify and align `order-status.ts` workflow transitions with update endpoint.
- [ ] Ensure realtime events + event names match web clients.
- [ ] Ensure socket cannot be spoofed for tenant events.

## Step 4: Menu module completion

- [ ] Verify variants/addons update logic is correct.
- [ ] Ensure image support path (upload/storage URL) is tenant-safe.
- [ ] Ensure availability toggle impacts ordering (service already checks isAvailable).

## Step 5: Inventory module completion

- [ ] Verify low stock alerts accuracy and tenant isolation.
- [ ] Ensure deductStock is atomic (transaction / concurrency handling).
- [ ] Implement/confirm purchase-order receiving -> stock updates OR adjust API contract to avoid incorrect claims.

## Step 6: Reservations module completion

- [ ] Validate reservation status workflow + transitions.
- [ ] Confirm availability checks follow business logic and time parsing.

## Step 7: Staff module (roles/permissions + employee management)

- [ ] Add missing Prisma models/tables only if required.
- [ ] Implement StaffModule with role-based access.
- [ ] Implement DTO validation + tenant-safe Prisma operations.

## Step 8: Security hardening

- [ ] Add Helmet middleware.
- [ ] Add rate limiting via ThrottlerModule.
- [ ] Ensure request logging interceptor includes correlationId and avoids PII leakage.
- [ ] Implement audit logs for critical writes.

## Step 9: API documentation + standards

- [ ] Add Swagger setup with auth scheme.
- [ ] Add swagger decorators for DTOs and response envelope.

## Step 10: Production quality

- [ ] Remove dead code.
- [ ] Fix TypeScript errors.
- [ ] Fix ESLint errors.
- [ ] Run build/lint/tests.
