# TODO — Sprint 6: Product Capability (Business OS)

## Step 0 — Repo/architecture validation

- [x] Confirm Capability Platform wiring (manifest contract + controller endpoints)
- [x] Confirm CapabilityRegistry bootstrap currently placeholder-only
- [x] Inspect Prisma schema baseline (tenant/restaurant-centric)

## Step 1 — Product capability backend scaffolding

- [x] Create `product-capability` Nest module (controller/service/types)
- [x] Implement Product Manifest definition (static manifest object)

## Step 2 — Capability Platform registration

- [ ] Add `capability-product` manifest into `CapabilityRegistry`
- [ ] Ensure manifest includes routes, widgets, navigation, API endpoints, events, configuration

## Step 3 — Database changes (Prisma)

- [ ] Extend `schema.prisma` with universal product catalog models
- [ ] Add migration SQL + update Prisma client generation (migration creation handled by existing workflow)

## Step 4 — Product CRUD API (no inventory/orders)

- [ ] Create DTOs for create/update/list/publish
- [ ] Implement Prisma-backed service + controller endpoints
- [ ] Ensure tenant-scoping only (no restaurant/inventory/order hooks)

## Step 5 — Frontend minimal wiring

- [ ] Add product page stub + service client (only if required by manifest/widget routing)

## Step 6 — Tests

- [ ] Add unit/integration tests for capability manifest presence
- [ ] Add tests for product CRUD persistence and publish status

## Step 7 — Build & verification

- [ ] Run backend tests
- [ ] Run build for api + web
- [ ] Smoke test capability manifest + product endpoints
