# Phase 31 Wave 3 — Payment Architecture

---

## Multi-Method Payment Abstraction

- **Provider-Independent Payment Abstraction**: Supports `CASH`, `CARD`, `UPI`, `STRIPE`, and `WALLET` payment methods without coupling core domain services to a single vendor SDK.
- **Cash Payment Tender Tracking**: Cash payments track tendered amount, change due, cashier ID, location ID, and timestamp.
