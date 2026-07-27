# Phase 26 — Platform Capability Matrix

This matrix maps out the platform capabilities and their verification status across different roles and licensing layers.

---

## 1. Plan & Entitlement Mapping

| Feature Key | Global Default | Starter Tier | Growth Tier | Enterprise Tier | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **multi_branch** | `false` | `false` | `true` | `true` | Verified on core controllers |
| **kds_station** | `false` | `true` | `true` | `true` | Verified on restaurant ops |
| **table_ordering**| `true` | `true` | `true` | `true` | Verified on QR modules |
| **patient_chart** | `false` | `false` | `false` | `true` | Verified on healthcare EMR |
| **route_optimizer**| `false` | `false` | `true` | `true` | Verified on logistics dispatch |

---

## 2. Role-Based Access Matrix

| Security Role | Access Level | Restricted Operations | Enforcement |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | Tenant Admin | View invoices, install packs, flag features | UI & API endpoints |
| **OWNER** | Tenant Owner | Manage outlets, assign seats, view reports | UI & API endpoints |
| **MANAGER** | Business Manager| Edit menu items, adjust stocks, schedules | UI & API endpoints |
| **CASHIER** | Front POS Cashier| Place POS orders, capture card payments | UI & API endpoints |
| **WAITER** | Table Waiter | Call chef, request tables checkouts | UI & API endpoints |
| **DOCTOR** | Health Doctor | View EMR charts, write prescriptions | MFA Challenge |
| **DRIVER** | Fleet Driver | Mark route stops completed, capture POD | UI & API endpoints |
