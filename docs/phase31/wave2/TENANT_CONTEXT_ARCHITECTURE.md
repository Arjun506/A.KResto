# Phase 31 Wave 2 — Tenant Context Architecture

---

## Canonical TenantContext Contract

```typescript
export interface TenantContext {
  userId: string;
  tenantId: string;
  organizationId: string;
  businessId: string;
  locationId?: string;
  roles: string[];
  permissions: string[];
  entitlements: string[];
  activePacks: string[];
}
```
