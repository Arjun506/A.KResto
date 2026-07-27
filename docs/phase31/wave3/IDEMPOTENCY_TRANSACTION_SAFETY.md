# Phase 31 Wave 3 — Idempotency & Transaction Safety

---

## Financial Idempotency & Concurrency

- **Idempotency Keys**: API write requests for checkout and payment initialization accept an `Idempotency-Key` header. Duplicate requests within 24 hours return identical stored response objects.
- **Database Atomicity**: Order creation, item snapshots, tax computation, and inventory reservations execute within Prisma `$transaction` database blocks.
