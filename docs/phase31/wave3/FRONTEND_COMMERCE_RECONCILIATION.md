# Phase 31 Wave 3 — Frontend Commerce Reconciliation

---

## Commerce UI & API Binding Verification

- **POS Checkout**: Restaurant POS and Retail POS call `/api/v1/orders` and `/api/v1/payments/intents`, rendering printable receipts on completion (`CONNECTED`).
- **Customer OS Checkout**: Consumer checkout workflow calls server pricing engine, renders cart subtotal, applies verified coupons, and triggers AK Pay shell (`CONNECTED`).
