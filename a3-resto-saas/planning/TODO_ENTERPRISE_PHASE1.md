# TODO_ENTERPRISE_PHASE1.md

## Restaurants module

- [x] Create `apps/api/src/restaurants/dto/create-restaurant.dto.ts`
- [x] Create `apps/api/src/restaurants/dto/update-restaurant.dto.ts`
- [x] Create `apps/api/src/restaurants/dto/restaurant-response.dto.ts`
- [x] Create `apps/api/src/restaurants/restaurants.service.ts`
- [x] Create `apps/api/src/restaurants/restaurants.controller.ts` (thin controller)
- [x] Create `apps/api/src/restaurants/restaurants.module.ts`

- [ ] Enforce tenant-safe Prisma `where: { restaurantId }` for all queries (except SUPER_ADMIN)
- [ ] Standardize responses to `{ success, message?, data? }` using `apiSuccess`

## Orders module + realtime

- [ ] Create `apps/api/src/orders/dto/create-order.dto.ts`
- [ ] Create `apps/api/src/orders/dto/update-order-status.dto.ts`
- [ ] Create `apps/api/src/orders/dto/order-response.dto.ts`

- [ ] Create `apps/api/src/orders/orders.service.ts` (business logic + Prisma)
- [ ] Create `apps/api/src/orders/orders.controller.ts` (thin controller)
- [ ] Create `apps/api/src/orders/orders.gateway.ts` (tenant rooms only)
- [ ] Create `apps/api/src/orders/orders.module.ts`
- [ ] Implement CRUD endpoints: create/list/get/update status/delete
- [ ] Tenant-aware filtering on all Prisma queries
- [ ] Realtime flow: on orderCreated emit only to `restaurant:${restaurantId}` room

## Tenant enforcement + typed user + auth hardening

- [ ] Add `apps/api/src/common/types/jwt-user.interface.ts`
- [ ] Add `apps/api/src/common/types/authenticated-request.interface.ts`
- [ ] Ensure `request.user` is strongly typed (module augmentation)
- [ ] Harden `JwtAuthGuard`, `RolesGuard`, `TenantGuard` to remove duplicate checks / unsafe casting

## Wiring

- [ ] Update `apps/api/src/app.module.ts`: remove old `RestaurantsController` registration, import new modules, register new OrdersGateway

## Verification

- [ ] `npm run start:dev` compiles cleanly
- [ ] CRUD + websocket tenant isolation smoke test
