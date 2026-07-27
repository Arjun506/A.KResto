# Phase 31 Wave 4 — Warehouse Engine

---

## Warehousing & Inter-Location Stock Transfers

- **Multi-Warehouse Support**: Warehouses configured per business location.
- **Stock Transfer Workflow**: `DRAFT ➔ REQUESTED ➔ APPROVED ➔ DISPATCHED ➔ IN_TRANSIT ➔ RECEIVED ➔ CANCELLED`. Dispatch logs `TRANSFER_OUT` at source and receipt logs `TRANSFER_IN` at destination.
