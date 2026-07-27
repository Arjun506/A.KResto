# Phase 30 — Existing UI Reuse & Extension Matrix

---

## Reusable Component Preservation Mapping

| Component Area | File / Package Path | Status | Proposed Reuse & Extension Plan |
| :--- | :--- | :--- | :--- |
| **Design Tokens & Theme** | `apps/web/app/globals.css` | `REUSE_AND_EXTEND` | Retain HSL color system; add dark mode tokens for multi-tenant cards |
| **UI Primitives** | `packages/ui/src/foundation.tsx` | `REUSE` | Retain Button, Card, Badge, Modal, Table; export unified Form primitives |
| **Auth Forms** | `apps/web/components/auth/` | `REUSE` | Retain login/signup/OTP forms; connect tenant context |
| **POS Layout & Cart** | `apps/web/app/dashboard/pos/` | `PRESERVE_RESTAURANT` | Retain table selection and cart engine; extend for retail barcode scanners |
| **Kitchen Display (KDS)** | `apps/web/app/dashboard/kitchen/` | `PRESERVE_RESTAURANT` | Retain ticket status columns; extend for worker task queues |
| **QR Order & Menu** | `apps/web/app/online-ordering/` | `PRESERVE_RESTAURANT` | Retain category & item view; generalize into Universal Catalog Reader |
| **Super Admin Console** | `apps/web/app/super-admin/` | `REUSE_AND_EXTEND` | Retain tenant/pilot management; add platform health indicators |
| **AK Connect Simulator** | `apps/web/app/ak-connect/` | `REUSE_AND_EXTEND` | Retain local mesh visualizer; bind to universal connection state provider |
