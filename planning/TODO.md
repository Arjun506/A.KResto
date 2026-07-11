# TODO

## A3 RESTO — Analytics Module Implementation

- [x] Create backend AnalyticsModule (module/controller/service)

- [ ] Implement endpoints:
  - [ ] GET /analytics/kpis
  - [ ] GET /analytics/revenue
  - [ ] GET /analytics/orders
  - [ ] GET /analytics/menu
- [ ] Ensure Prisma aggregation queries + tenant-safe filtering + SUPER_ADMIN bypass
- [ ] Replace frontend mocked dashboard metrics with real backend data
- [ ] Add loading states, skeleton loaders, and error states
- [ ] Wire realtime updates to refetch analytics on `orderCreated` and `orderStatusChanged`
- [ ] Ensure no demo data is created (real DB only)
- [ ] Verify build + run smoke tests
