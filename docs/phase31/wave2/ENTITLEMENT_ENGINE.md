# Phase 31 Wave 2 — Entitlement Engine

---

## Subscription & Pack Entitlement Enforcement

- **Entitlement Barrier**: API requests to protected pack endpoints verify active subscription tier and pack activation state. If a pack is inactive, the backend returns HTTP 403 with `UPGRADE_REQUIRED` error code.
- **Usage Limits**: Max locations (`maxLocations`), max staff (`maxStaff`), and max monthly orders (`maxMonthlyOrders`) enforced server-side.
