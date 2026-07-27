# Phase 31 Wave 3 — Refund Engine

---

## Refund Execution & Over-Refund Prevention

- **Refund Limit Barrier**: Total refunded amount is tracked on the transaction record. Cumulative refunds cannot exceed the original captured payment amount.
- **Refund Idempotency**: Refund requests enforce idempotency keys to prevent duplicate refund issues.
- **Permission Check**: Executing refunds requires manager authorization (`@RequirePermission('billing.manage')`).
