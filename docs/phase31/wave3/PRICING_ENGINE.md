# Phase 31 Wave 3 — Pricing Engine

---

## Server-Authoritative Pricing Pipeline

```
Line Base Price
+ Modifiers & Option Adjustments
= Line Gross

Subtotal (Sum of Line Gross)
- Discounts (Coupon / Promo allocations)
+ Taxes (GST / Service Tax)
+ Charges (Delivery / Service Fee)
= Grand Total
```

- **Price Tampering Protection**: Client-submitted totals are ignored; the server re-fetches canonical catalog item prices and re-calculates all line items.
