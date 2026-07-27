# Phase 30 Wave 1 — Access Control UI Foundation

---

## Role & Entitlement Enforcement Architecture

- **Role-Based Access Control (RBAC)**: Evaluates user roles (`SUPER_ADMIN`, `TENANT_ADMIN`, `MANAGER`, `STAFF`, `CUSTOMER`). Routes and UI actions are conditionally rendered using standard `PermissionDenied` primitives when unauthorized.
- **Entitlement & Subscription Guards**: Validates active tenant plan limits (e.g., branch count, seat limits, advanced analytics). Renders `UpgradeRequired` component when a feature exceeds current subscription tier.
- **Industry Pack Activation**: Evaluates active tenant industry packs. Unregistered industry routes automatically display pack activation prompts.
