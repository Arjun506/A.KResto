# Phase 30 Wave 3 — Universal Commerce UX Specifications

---

## Shared Transaction Pipeline

```
Offering Selection ➔ Cart Assembly ➔ Checkout Review ➔ AK Pay Orchestration ➔ Confirmation & Tracking
```

### Key Elements
- **Cart Isolation**: Prevents incompatible multi-provider items from mixing into a single checkout transaction.
- **AK Pay Orchestration**: Orchestrates UPI, card, and cash payment methods with transparent processing status without storing raw card secrets.
- **Order Confirmation & Digital Receipts**: Generates digital receipts with explicit status timelines.
