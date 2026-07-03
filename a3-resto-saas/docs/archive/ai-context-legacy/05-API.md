# API

## Backend (NestJS)

### Base URL

- Backend listens on: `process.env.PORT ?? 3001`.

### Auth

File: `apps/api/src/auth/auth.controller.ts`

- POST `/auth/register`
- POST `/auth/login`

### Orders

File: `apps/api/src/orders/orders.controller.ts`

- POST `/orders`
  - Guarded by: `JwtAuthGuard`, `TenantGuard`, `RolesGuard`
  - Roles: OWNER/RESTAURANT_OWNER/MANAGER/CASHIER/WAITER/SUPER_ADMIN
- GET `/orders`
  - Roles: OWNER/RESTAURANT_OWNER/MANAGER/CASHIER/WAITER/CHEF/SUPER_ADMIN
- GET `/orders/:id`
- PATCH `/orders/:id/status`
  - Validates enterprise order statuses + transition rules.
- DELETE `/orders/:id`

## Frontend API Client

File: `apps/web/services/api.ts`

- Axios wrapper
- BaseURL from `NEXT_PUBLIC_API_URL` else `http://localhost:3001`
- Request interceptor attaches `Authorization: Bearer <token>` from `localStorage` token.
- 401 handler (browser): clears token and redirects to `/login`.

## Web Services

- `apps/web/services/order.service.ts`
  - `getOrders()` → GET `/orders`
  - `createOrder()` → POST `/orders`
  - `updateOrderStatus()` → PATCH `/orders/:id/status`

## TODO

- Document menu/inventory/reservations/uploads/analytics/restaurants/public endpoints.
