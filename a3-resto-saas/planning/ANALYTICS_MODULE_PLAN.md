# A3 RESTO — Analytics Module Implementation Plan

## Information Gathered

- Frontend analytics page `apps/web/app/dashboard/analytics/page.tsx` is fully mocked (hardcoded revenue/order/customer/item data).
- Backend has a realtime `OrdersGateway` (`apps/api/src/gateways/orders.gateway.ts`) that already emits Socket.IO events:
  - `orderCreated`
  - `orderStatusChanged`
- Backend multi-tenant approach exists in `OrdersService`:
  - tenant-safe filtering via `restaurantId` from `JwtUser`
  - `SUPER_ADMIN` bypass returns `{}` tenant filter
- Backend current module structure: App module imports feature modules under `apps/api/src/*`.

## Plan

### Backend (NestJS)

1. Create new folder `apps/api/src/analytics/` with:
   - `analytics.module.ts`
   - `analytics.controller.ts`
   - `analytics.service.ts`
   - (optional internal DTOs/types if needed)
2. Controller endpoints:
   - `GET /analytics/kpis`
   - `GET /analytics/revenue`
   - `GET /analytics/orders`
   - `GET /analytics/menu`
3. Service logic using Prisma aggregations only (no demo/mock data):
   - KPIs: totalRevenue, todayRevenue, totalOrders, todayOrders, activeCustomers, averageOrderValue
   - Revenue charts: daily/weekly/monthly buckets based on `orders.createdAt`
   - Orders charts: orders grouped by status, and orders grouped by day (for time range)
   - Menu charts: top and lowest selling items based on aggregated `order_items` (quantity and/or revenue)
4. Tenant-safe filtering:
   - Implement helper similar to `OrdersService`:
     - if `SUPER_ADMIN` => no `restaurantId` filter
     - else `where: { restaurantId: user.restaurantId }`
5. Wire realtime:
   - Ensure existing events `orderCreated` and `orderStatusChanged` will trigger frontend refresh.
   - Backend should not create demo events; analytics endpoints remain pull-based.

### Frontend (Next.js)

1. Replace `apps/web/app/dashboard/analytics/page.tsx` mocked visuals with real backend calls.
2. Use existing API client `apps/web/services/api.ts` patterns (no demo data).
3. Add:
   - Loading states (card skeletons + chart skeletons)
   - Error states (inline error banners)
4. Real-time refresh:
   - Use existing realtime hook `apps/web/hooks/use-realtime.ts` or existing socket service to listen to `orderCreated` and `orderStatusChanged`.
   - On event, re-fetch KPI + chart data.

## Dependent Files to be edited

- `apps/web/app/dashboard/analytics/page.tsx`
- `apps/api/src/app.module.ts` (to import `AnalyticsModule`)
- `apps/api/src/analytics/*` (new files)

## Followup steps

1. Run backend tests/build:
   - `npm run build` (root or per-package)
2. Run lint/typecheck for affected packages.
3. Manually verify endpoints from frontend.

## Remaining analytics blockers

- None identified yet, but need to confirm Prisma schema fields for:
  - `orders.totalAmount` type (number/decimal)
  - `order_items` relation to menu items (menu item id/name fields)
  - “activeCustomers” definition (likely customers with orders in last N days or all time)

<ask_followup_question>
Confirm whether “activeCustomers” should mean: (A) customers who placed at least one order in the last 30 days, or (B) customers with any orders historically. If no preference, default to (A) last 30 days.
</ask_followup_question>
