# Phase 31 Wave 4 — Procurement Engine

---

## Purchasing & Supplier Operations

- **Supplier Directory**: Tenant-scoped supplier registry storing commercial terms and active status.
- **Purchase Order Lifecycle**: `DRAFT ➔ SUBMITTED ➔ APPROVED ➔ ORDERED ➔ PARTIALLY_RECEIVED ➔ RECEIVED ➔ CANCELLED`.
- **Goods Receipt**: Receiving purchase orders logs a `PURCHASE_RECEIPT` stock movement, increasing warehouse inventory.
