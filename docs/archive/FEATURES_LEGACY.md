# Project Features Overview

The AK Business OS (Restaurant SaaS) platform includes the following major functional modules:

| Feature | Description | Key Files / Directories |
|---------|-------------|--------------------------|
| **Authentication & Authorization** | JWT based auth, role‑based guards, password hashing | `apps/api/src/auth/*`, `jwt.strategy.ts`, `roles.guard.ts` |
| **Multi‑Tenant** | Tenant resolution from request headers, tenant‑scoped services | `apps/api/src/tenant/*` |
| **Dashboard (Super Admin)** | Admin UI for managing restaurants, users, analytics | `apps/web/app/super-admin/*` |
| **Restaurant Management** | CRUD for restaurants, tables, QR codes | `apps/api/src/restaurants/*`, `apps/web/app/restaurant/*` |
| **Menu & Catalog** | Categories, menu items, variants, addons | `apps/api/src/menu/*`, `apps/web/app/restaurant/*` |
| **Inventory** | Stock tracking, low‑stock alerts, supplier integration | `apps/api/src/inventory/*` |
| **Orders & POS** | Order creation, status workflow, POS endpoints | `apps/api/src/orders/*`, `apps/web/app/order/*` |
| **Reservations** | Table reservation handling, status lifecycle | `apps/api/src/reservations/*`, `apps/web/app/book-table/*` |
| **Online / QR Ordering** | Public ordering UI, QR‑code based table identification | `apps/web/app/online-ordering/*`, `apps/web/app/qr-order/*` |
| **Billing & Subscriptions** | Subscription plans, billing cycles, payment tracking | `apps/api/src/subscriptions/*`, `apps/web/app/dashboard/*` |
| **Analytics** | Reporting on sales, inventory, usage metrics | `apps/api/src/analytics/*`, `apps/web/app/dashboard/*` |
| **Staff Management** | Users with roles, activity logs, audit trail | `apps/api/src/users/*`, `apps/api/src/audit/*` |
| **Uploads** | Media upload handling (icons, menu images) | `apps/api/src/uploads/*` |
| **Queue / Background Jobs** | Async processing via Bull or similar (not fully explored) | `apps/api/src/queue/*` |
| **Public API** | Public endpoints for menu/ordering without auth | `apps/api/src/public/*` |

These modules are organized as NestJS feature modules and exposed through a unified API gateway.
