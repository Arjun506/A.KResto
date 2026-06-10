# TODO — A3 RESTO FINAL MVP COMPLETION PHASE

## Phase 1 — QR ORDERING

- [x] Replace demo QR ordering page with real backend-driven flow
- [x] Implement persistent cart (localStorage) + realtime order tracking wiring
- [x] Implement checkout -> real createOrder API call
- [ ] Link restaurant + table using existing QR/table routing
- [ ] Add waiter request + kitchen tracking handling (Socket.IO events)
- [ ] Implement rewards system on successful orders/status changes
- [ ] Backend updates if missing: rewards, table assignment, waiter request events

## Phase 2 — DASHBOARD ANALYTICS

- [ ] Replace hardcoded KPI cards/charts with API-driven data
- [ ] Implement Daily analytics API (tenant-safe)
- [ ] Wire frontend charts to backend endpoints

## Phase 3 — STAFF MANAGEMENT

- [ ] Replace demo staff page with real Staff CRUD UI
- [ ] Implement/verify backend staff module: staff CRUD, roles, permissions, assignment
- [ ] Wire UI to backend

## Phase 4 — TENANT SECURITY AUDIT

- [ ] Audit tenantId filtering in Menu/Inventory/Reservations/Staff/Billing/Uploads/Socket.IO
- [ ] Fix tenant-safe Prisma queries
- [ ] Verify SUPER_ADMIN bypass behavior and consistency

## Phase 5 — PRODUCTION HARDENING

- [ ] Fix localStorage auth checks robustness
- [ ] Fix hydration issues + client/server boundaries
- [ ] Add loading states + error handling
- [ ] Add error boundaries where missing

## Production checks

- [ ] Run: npm run lint
- [ ] Run: npm run build
- [ ] Run: npm run start:dev
- [ ] Fix remaining TS/ESLint issues until clean
