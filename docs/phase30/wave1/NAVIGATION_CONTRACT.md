# Phase 30 Wave 1 — Navigation Contract

---

## Typed Navigation Configuration Contract

```typescript
export interface NavigationItem {
  id: string;
  label: string;
  icon: string; // Icon identifier string or ReactNode
  route: string;
  requiredPack?: string;        // e.g., 'RESTAURANT', 'HOTEL', 'LOGISTICS'
  requiredRole?: string[];      // e.g., ['OWNER', 'MANAGER']
  requiredPermission?: string;  // e.g., 'orders:manage'
  requiredEntitlement?: string; // e.g., 'multi_location'
  badge?: string | number;
  children?: NavigationItem[];
  mobileVisibility?: boolean;
}
```

### Navigation Resolution Pipeline
When resolving the sidebar or menu items for an authenticated user context:
1. Check authenticated user role (`requiredRole`).
2. Filter active industry packs enabled on tenant (`requiredPack`).
3. Evaluate RBAC permissions (`requiredPermission`).
4. Validate subscription entitlements (`requiredEntitlement`).
