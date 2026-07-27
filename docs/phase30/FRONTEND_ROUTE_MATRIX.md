# Phase 30 — Frontend Route Matrix

---

## Complete Route Audit & Classification

| Route Path | Domain | Target Persona | Status Classification | Primary Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Landing | Visitor | `IMPLEMENTED` | Static / Web Features |
| `/login` | Auth | User / Staff | `BACKEND_CONNECTED` | NestJS `/api/v1/auth/login` |
| `/signup` | Auth | Owner | `BACKEND_CONNECTED` | NestJS `/api/v1/auth/register` |
| `/onboarding` | Onboarding | Tenant Owner | `BACKEND_CONNECTED` | NestJS `/api/v1/saas/onboard` |
| `/select-industry` | Onboarding | Owner | `IMPLEMENTED` | Local / Context State |
| `/dashboard` | Business OS | Owner / Manager | `PARTIAL` | REST API + Mock Metrics |
| `/dashboard/ai-insights` | AI Operator | Executive | `UI_ONLY` | Mock Insights Engine |
| `/dashboard/analytics` | Analytics | Manager | `PARTIAL` | REST API `/api/v1/analytics` |
| `/dashboard/app-store` | Ecosystem | Admin | `UI_ONLY` | Mock App Store Registry |
| `/dashboard/billing` | SaaS | Owner | `BACKEND_CONNECTED` | NestJS `/api/v1/saas/subscriptions` |
| `/dashboard/customers` | CRM | Staff | `BACKEND_CONNECTED` | NestJS `/api/v1/customers` |
| `/dashboard/finance` | Finance | CFO / Accountant | `UI_ONLY` | Mock Ledger Data |
| `/dashboard/growth` | Growth | Marketer | `UI_ONLY` | Mock Campaign Engine |
| `/dashboard/healthcare` | Healthcare | Doctor / Admin | `UI_ONLY` | Mock EMR & Appointments |
| `/dashboard/hotel` | Hotel | Receptionist | `UI_ONLY` | Mock Room Reservations |
| `/dashboard/inventory` | Inventory | Store Manager | `BACKEND_CONNECTED` | NestJS `/api/v1/inventory` |
| `/dashboard/invoice` | Billing | Accountant | `PARTIAL` | REST API `/api/v1/invoices` |
| `/dashboard/kitchen` | Worker OS | Chef / KDS | `BACKEND_CONNECTED` | NestJS `/api/v1/orders` |
| `/dashboard/launch-center` | Platform | Owner | `UI_ONLY` | Quick Actions Hub |
| `/dashboard/logistics` | Logistics | Dispatcher | `UI_ONLY` | Mock Shipment Routes |
| `/dashboard/menu` | Catalog | Manager | `BACKEND_CONNECTED` | NestJS `/api/v1/restaurants/menu` |
| `/dashboard/notifications` | Comms | All | `PARTIAL` | Notification Hub |
| `/dashboard/orders` | Operations | Staff | `BACKEND_CONNECTED` | NestJS `/api/v1/orders` |
| `/dashboard/payments` | Finance | Cashier | `PARTIAL` | REST API `/api/v1/payments` |
| `/dashboard/pos` | Worker OS | Cashier | `BACKEND_CONNECTED` | NestJS `/api/v1/orders` |
| `/dashboard/qr-tables` | Operations | Manager | `BACKEND_CONNECTED` | NestJS `/api/v1/restaurants/tables` |
| `/dashboard/reports` | Analytics | Executive | `UI_ONLY` | Mock Financial Reports |
| `/dashboard/reservations` | Operations | Host | `BACKEND_CONNECTED` | NestJS `/api/v1/reservations` |
| `/dashboard/restaurant-operations` | Ops | Manager | `PARTIAL` | Ops Hub |
| `/dashboard/settings` | Admin | Manager | `BACKEND_CONNECTED` | NestJS `/api/v1/tenant/settings` |
| `/dashboard/staff` | Workforce | Manager | `BACKEND_CONNECTED` | NestJS `/api/v1/users` |
| `/dashboard/table-management` | Ops | Host | `BACKEND_CONNECTED` | NestJS `/api/v1/restaurants/tables` |
| `/dashboard/waiter` | Worker OS | Waiter | `BACKEND_CONNECTED` | NestJS `/api/v1/orders` |
| `/customer` | Customer OS | Consumer | `PARTIAL` | Discovery & Catalog API |
| `/online-ordering` | Customer OS | Consumer | `BACKEND_CONNECTED` | NestJS Public Menu API |
| `/qr-order` | Customer OS | Diner | `BACKEND_CONNECTED` | NestJS QR Order API |
| `/book-table` | Customer OS | Diner | `BACKEND_CONNECTED` | NestJS Reservation API |
| `/checkout` | Customer OS | Consumer | `PARTIAL` | Order Submission API |
| `/delivery-partner/dashboard` | Partner OS | Driver | `UI_ONLY` | Mock Driver Trips |
| `/super-admin` | Platform OS | Super Admin | `BACKEND_CONNECTED` | NestJS `/api/v1/super-admin` |
| `/super-admin/pilots` | Platform OS | Super Admin | `BACKEND_CONNECTED` | NestJS `/api/v1/super-admin/pilots` |
| `/ak-connect` | AK Connect | Mesh Operator | `UI_ONLY` | Local Network Simulator |
