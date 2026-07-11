# TODO_EPIC11 – Smart POS & Billing Center (AK Business OS)

## Step 1 — Repo validation (blocking)

- [x] Identify EPIC10/legacy POS UI entrypoint
- [x] Confirm existing frontend services: menu/order/table
- [x] Confirm backend Orders APIs: createOrder + checkoutOrder + status + timeline
- [ ] Read Prisma schema to confirm whether metadata/tags are sufficient for POS features (split/merge/transfer/discount/coupons/tips)
- [ ] Inspect existing websocket gateway / event payloads for order workflow (kitchen/KOT)
- [ ] Identify any existing customer module endpoints and refund/return endpoints

## Step 2 — Frontend build (premium glass POS)

- [ ] Replace `apps/web/app/dashboard/pos/page.tsx` with componentized EPIC11 POS shell
- [ ] Implement Left panel (categories/search/filters/popular/recommended)
- [ ] Implement Center product grid (images, variants, add-ons, availability)
- [ ] Implement Right cart/order panel (quantities, notes, customer/table, totals breakdown)
- [ ] Implement Bottom payment methods + split payment UI + receipt print/share
- [ ] Add modals for: item modifiers + hold/resume + split bill + receipt preview
- [ ] Implement keyboard shortcuts (F1..F4 + extra POS shortcuts)
- [ ] Add dark/light mode (system + toggle)
- [ ] Add favorites + recent orders (session/local or backend-backed if available)

## Step 3 — POS workflow integration (reuse backend engines)

- [ ] Map cart operations to backend order engine using:
  - orders.createOrder (for create/draft)
  - orders.checkoutOrder (for settlement)
  - orders.updateOrderStatus and tags for resume/hold states
- [ ] Kitchen notes / KOT workflow wiring to backend timeline/events
- [ ] Discount/coupon/tip/service charge/taxes handling via orders.checkoutOrder discount + orders.metadata

## Step 4 — Backend extensions (only if missing)

- [ ] Add missing endpoints for customers panel + customer history
- [ ] Add/extend endpoints for refunds & returns (if required by EPIC11 spec)
- [ ] Add POS-specific payment settlement support if orders.checkoutOrder cannot persist required payment breakdown
- [ ] Add/extend kitchen display integration if not supported via existing websocket events

## Step 5 — Testing

- [ ] Backend unit/integration tests for checkout metadata writes + workflow transitions
- [ ] API tests: createOrder/checkoutOrder/status
- [ ] Realtime tests (gateway emits + UI contract)
- [ ] Frontend UI tests for POS workflow + responsive layout

## Step 6 — Final checklist

- [ ] Performance: reduced re-renders + fast navigation
- [ ] Accessibility: keyboard navigation + readable touch targets
- [ ] Receipt printing flow works
- [ ] Split/merge/transfer happy paths covered
