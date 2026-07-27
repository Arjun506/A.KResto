# Phase 31 Wave 6 — Industry Pack Backend Contract

---

## Industry Pack Manifest Specification

```typescript
export interface IndustryPackManifest {
  packId: string;
  version: string;
  name: string;
  description: string;
  requiredCapabilities: string[];
  requiredPermissions: string[];
  defaultRoles: {
    roleName: string;
    permissions: string[];
  }[];
  terminology: Record<string, string>;
  adapters: {
    commerceAdapter?: string;
    inventoryAdapter?: string;
    bookingAdapter?: string;
    taskAdapter?: string;
  };
}
```
