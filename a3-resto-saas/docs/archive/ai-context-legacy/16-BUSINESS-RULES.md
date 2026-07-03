# Business Rules

## Orders (Enterprise Contract)

Source: `apps/api/src/orders/order-status.ts`

Enterprise OrderStatus:

- PENDING
- PREPARING
- READY
- COMPLETED
- CANCELLED

Transition rules:

- PENDING → PREPARING, CANCELLED
- PREPARING → READY, CANCELLED
- READY → COMPLETED, CANCELLED
- COMPLETED → none
- CANCELLED → none

Prisma mapping:

- Prisma includes an extra `ACCEPTED`.
- Enterprise mapping deterministically maps ACCEPTED → PENDING.

Enforcement:

- `OrdersService.updateOrderStatus()` validates:
  - status is a known enterprise value
  - transition is allowed from current state
  - dto.status transitions then updates Prisma status

## Tenant Isolation

- Orders queries/mutations scoped by `restaurantId` from JWT.
- SUPER_ADMIN may access without restaurantId (handled in service-level tenant where).

## TODO

- Document business rules for menu availability, reservation status transitions, inventory replenishment, uploads, and analytics.
