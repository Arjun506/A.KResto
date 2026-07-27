# Phase 31 Wave 1 — API Endpoint Registry

---

## Core REST API Endpoint Inventory

| Endpoint Route | HTTP Method | Controller / Service | Auth Guard | Tenant Scoped |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | `AuthController.login` | Public | No |
| `/api/v1/auth/register` | `POST` | `AuthController.register` | Public | No |
| `/api/v1/auth/me` | `GET` | `AuthController.getProfile` | `JwtAuthGuard` | Yes |
| `/api/v1/tenants` | `GET` / `POST` | `TenantController` | `JwtAuthGuard` | Platform / Org |
| `/api/v1/businesses` | `GET` / `POST` | `BusinessController` | `JwtAuthGuard` | Yes |
| `/api/v1/restaurants` | `GET` / `POST` | `RestaurantsController` | `JwtAuthGuard` | Yes |
| `/api/v1/orders` | `GET` / `POST` | `OrdersController` | `JwtAuthGuard` | Yes |
| `/api/v1/inventory` | `GET` / `POST` | `InventoryController` | `JwtAuthGuard` | Yes |
| `/api/v1/payments/intents` | `POST` | `PaymentController` | `JwtAuthGuard` | Yes |
| `/api/v1/notifications` | `GET` / `PATCH`| `NotificationsController` | `JwtAuthGuard` | Yes |
| `/api/v1/search` | `GET` | `SearchController` | `JwtAuthGuard` | Yes |
| `/api/v1/ai/prompt` | `POST` | `AiPlatformController` | `JwtAuthGuard` | Yes |
| `/api/v1/health/live` | `GET` | `HealthController.live` | Public | No |
| `/api/v1/health/ready` | `GET` | `HealthController.ready` | Public | No |
