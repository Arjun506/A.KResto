# Decisions

## Order Status Contract Mapping (Enterprise vs Prisma)

- Decision: Maintain an enterprise order lifecycle contract enum with transition rules, and map Prisma status values deterministically.
- Reason: Prisma enum includes an extra `ACCEPTED` value; enterprise contract excludes it.
- Alternatives Considered:
  - Modify Prisma enum to match enterprise contract.
  - Drop transition validation.
- Date: (discovered from code; 2026-07-01)
- Impact:
  - `PATCH /orders/:id/status` enforces valid transitions.
  - Frontend/backoffice can rely on stable enterprise statuses.

## Tenant Isolation on Orders

- Decision: TenantGuard + service-level tenant where clause.
- Reason: Enforce restaurant scoping and prevent cross-tenant access.
- Alternatives Considered:
  - Rely only on front-end filtering.
  - Skip tenant guard for non-read operations.
- Date: (discovered from code; 2026-07-01)
- Impact:
  - OrdersService checks JWT `restaurantId` unless SUPER_ADMIN.

## Frontend Token Handling

- Decision: Store JWT access token in `localStorage` under `token` and decode it client-side.
- Reason: Simpler stateless session handling for dashboard UX.
- Alternatives Considered:
  - HTTP-only cookie sessions.
  - Server-side sessions.
- Date: (discovered from code)
- Impact:
  - Easier role routing; requires 401 handling (clear token + redirect).

## Orders Module Authorization Model

- Decision: Use NestJS guards `JwtAuthGuard`, `TenantGuard`, `RolesGuard` on OrdersController.
- Reason: Centralize authn/authz and keep service methods focused on domain logic.
- Alternatives Considered:
  - Move all authorization into service methods.
  - Skip RolesGuard and rely on UI role.
- Date: (discovered from code)
- Impact:
  - Endpoint-level role allowlists for create/read/update/delete.
