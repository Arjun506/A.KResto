# Phase 30 Wave 2 — Multi-Business & Multi-Location UX Specifications

---

## Organizational Hierarchy & Switching Model

```
Organization (e.g. AK Group HQ)
  ├── Business Division A (e.g. Restaurant Division)
  │    ├── Location 1 (Indiranagar Branch)
  │    └── Location 2 (Koramangala Branch)
  └── Business Division B (e.g. Retail Division)
       └── Location 1 (MG Road Store)
```

### UX Selector Controls
- **Organization Selector**: Filters tenant organization scope.
- **Business Selector**: Toggles between specific business entities or "All Businesses".
- **Location Selector**: Toggles between specific branch locations or "All Locations".
- **Tenant Scope Guard**: Prevents cross-tenant data leakage by enforcing tenant-scoped headers on all underlying REST and Socket API queries.
