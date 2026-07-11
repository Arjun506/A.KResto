# TODO — EPIC CORE-INV-1 (Universal Inventory Engine) — Sprint 4 — AK Business OS Version 1.0

## Step 1 — Audit & Gap Verification (backend + db + realtime + frontend)

- [ ] Confirm existing inventory endpoints cover items/suppliers/purchase orders/low-stock/stock deduction only.
- [ ] Identify existing patterns for audit logs (`audit_logs`) usage across other modules.
- [ ] Identify existing socket gateway patterns (like `OrdersGateway`) and how to add inventory events.
- [ ] Confirm whether any inventory UI already exists; list missing frontend routes/components.

## Step 2 — Database Design (Prisma schema)

- [ ] Create warehouse + stock movement/ledger models.
- [ ] Create goods receipt models linking purchase orders to inventory increases.
- [ ] Create transfer/adjustment/waste/expiry/batch tracking models.
- [ ] Create reorder suggestion + valuation base fields/models (as required).
- [ ] Create/extend enums for inventory movement types, receipt status, waste/expiry/batch status.

## Step 3 — Backend Domain & Services

- [ ] Implement stock ledger engine (single source of truth):
  - [ ] write movement entries
  - [ ] compute/update on-hand by warehouse/batch
  - [ ] enforce constraints (no negative unless configured)
- [ ] Implement goods receipt flow:
  - [ ] `receive` adds inventory via ledger
  - [ ] updates PO status to RECEIVED
  - [ ] emits socket event `purchase.received`
- [ ] Implement transfer/adjustment/waste/expiry endpoints backed by ledger.
- [ ] Implement low stock + reorder suggestion generation backed by ledger.

## Step 4 — Realtime Events

- [ ] Add Inventory socket gateway emitting:
  - [ ] `inventory.updated`
  - [ ] `stock.low`
  - [ ] `purchase.received`
  - [ ] `transfer.completed`
  - [ ] `recipe.consumed`
- [ ] Implement tenant room scoping consistent with OrdersGateway.

## Step 5 — Automatic Integration (recipe consumption hook)

- [ ] Find kitchen/order completion integration point(s).
- [ ] Implement inventory consumption service called when recipes are consumed.
- [ ] Emit `recipe.consumed` and trigger low stock checks.

## Step 6 — Audit Logs

- [ ] Add audit log writes for all inventory mutations:
  - [ ] items
  - [ ] suppliers
  - [ ] receiving
  - [ ] transfers
  - [ ] adjustments
  - [ ] waste/expiry
- [ ] Standardize entity/action/change payload.

## Step 7 — Frontend Build (missing inventory UI)

- [ ] Inventory dashboard screen (cards + low-stock)
- [ ] Warehouse view
- [ ] Stock cards / movement timeline
- [ ] Supplier + Purchase Orders + Receiving
- [ ] Transfer + Adjustment + Waste + Expiry screens
- [ ] Reports page(s)
- [ ] Socket-driven realtime refresh on relevant events.

## Step 8 — Quality Gates

- [ ] Prisma migration apply / schema typecheck
- [ ] Backend unit/integration tests for ledger invariants
- [ ] Frontend build + lint
- [ ] Workflow tests for:
  - [ ] receiving increases stock
  - [ ] deduct decreases stock
  - [ ] low stock triggers `stock.low`
  - [ ] cannot over-deduct
