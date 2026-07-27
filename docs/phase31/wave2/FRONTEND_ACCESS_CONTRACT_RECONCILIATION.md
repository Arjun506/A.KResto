# Phase 31 Wave 2 — Frontend Access Contract Reconciliation

---

## Frontend UI State & Backend Response Mapping

- **Permission Denied State**: Unprivileged backend responses trigger `@business-os/ui` `PermissionDenied` component rendering.
- **Upgrade Required State**: Inactive subscription or pack tier responses trigger `@business-os/ui` `UpgradeRequired` component rendering.
