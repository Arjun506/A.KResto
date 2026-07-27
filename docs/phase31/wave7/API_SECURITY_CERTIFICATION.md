# Phase 31 Wave 7 — API Security Certification

---

## API Authorization & Guard Audit

- **IDOR Protection**: Endpoint parameters (`/orders/:id`, `/bookings/:id`, `/files/:id`) verify resource ownership server-side.
- **RBAC & Entitlements**: All controllers decorate endpoints with `@RequirePermission()` and `@RequireEntitlement()`, backed by `PermissionsGuard` and `EntitlementGuard`.
