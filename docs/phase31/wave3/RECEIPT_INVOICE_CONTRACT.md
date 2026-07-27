# Phase 31 Wave 3 — Receipt & Invoice Contract

---

## Immutable Receipt & Invoice Generation

- **Immutable Receipts**: Generated receipts store a static JSON snapshot of item names, unit prices, discounts, tax rates, payment method, and transaction timestamp.
- **Invoice Numbering**: Tenant/location collision-resistant sequence (e.g. `INV-LOC1-2026-00412`).
