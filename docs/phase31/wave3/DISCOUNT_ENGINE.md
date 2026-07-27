# Phase 31 Wave 3 — Discount Engine

---

## Promotion & Discount Engine Specifications

- **Coupon Validation**: Validates min spend, expiration date, max redemptions, and tenant scope.
- **Negative Total Barrier**: Discounts are capped at line subtotal, preventing negative order totals.
- **Manual Discount Authorization**: Manual cashier discounts require `@RequirePermission('billing.manage')` or explicit manager approval.
