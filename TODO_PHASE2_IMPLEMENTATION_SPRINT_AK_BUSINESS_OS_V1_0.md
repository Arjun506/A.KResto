# TODO_PHASE2_IMPLEMENTATION_SPRINT_AK_BUSINESS_OS_V1_0.md

This sprint completes EPIC OPS-2: Smart POS & Restaurant Operations Hub (AK Business OS v1.0).

## Step 0 — Evidence & audit baseline

- [x] Audit existing POS/restaurant-operations implementation (UI + backend Orders workflow + sockets)
- [x] Identify gaps: split/merge/transfer, refund, tips, wallet, daily closing, EPIC11 socket event names
- [x] Audit Prisma schema: missing payment/bill/invoice/refund/shift closing models

## Step 1 — Create missing workflow sockets contract

- [ ] Map existing order/kitchen events to required EPIC11 socket event names:
  - [ ] bill.created
  - [ ] bill.updated
  - [ ] payment.completed
  - [ ] payment.failed
  - [ ] table.updated
  - [ ] invoice.generated

## Step 2 — Backend support for table operations

- [ ] Implement merge tables endpoint(s) in tables controller/service
- [ ] Implement transfer tables endpoint(s)
- [ ] Implement split bill backend primitive(s) (minimal viable mapping to existing Orders model)

## Step 3 — POS UI wiring for missing table/bill flows

- [ ] Replace merge/transfer toast stubs with API-driven flows + optimistic UI
- [ ] Replace split calculator with API-backed split checkout flow + receipts

## Step 4 — Tips + wallet + multiple payment wiring

- [ ] Add wallet option in POS UI
- [ ] Extend checkout payload to persist tips + paymentMethod metadata

## Step 5 — Refunds

- [ ] Add refund/return endpoint(s) + audit logs + socket events mapping
- [ ] Add refund UI entrypoints

## Step 6 — Daily closing / EOD settlement

- [ ] Add shift/day close endpoint(s)
- [ ] Persist closing summary (minimal model/fields)
- [ ] Replace EOD alert mock with API-driven UI

## Step 7 — Testing & build gates

- [ ] Backend build + Prisma validate + ESLint
- [ ] Frontend build + TS/ESLint
- [ ] Add/adjust workflow tests for:
  - [ ] checkout + socket events
  - [ ] table update events
  - [ ] split/merge/transfer minimal paths
  - [ ] refund + daily closing

## Step 8 — Completion matrix update

- [ ] Update completion matrix + capture evidence links/notes
