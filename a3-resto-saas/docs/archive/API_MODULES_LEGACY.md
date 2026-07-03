# API Modules Overview

The backend API (`apps/api`) is built with **NestJS** and follows a modular design. Each functional domain lives in its own folder under `src/` and exposes a NestJS **Module** that bundles Controllers, Services, and Providers.

| Module | Purpose | Key Controllers / Services |
|--------|---------|-----------------------------|
| `auth` | JWT authentication, login, registration, role‑based guards | `AuthController`, `AuthService`, `JwtStrategy`, `RolesGuard` |
| `restaurants` | Core restaurant entity management (profile, branding, settings) | `RestaurantsController`, `RestaurantsService` |
| `menu` | Menu hierarchy – categories, items, variants, addons | `MenuController`, `MenuService` |
| `inventory` | Stock tracking, low‑stock alerts, supplier linking | `InventoryController`, `InventoryService` |
| `orders` | Order lifecycle (creation, status updates, payment) | `OrdersController`, `OrdersService` |
| `reservations` | Table reservations and booking workflow | `ReservationsController`, `ReservationsService` |
| `analytics` | Reporting endpoints for sales, inventory, usage | `AnalyticsController`, `AnalyticsService` |
| `subscriptions` | SaaS subscription plans, billing periods | `SubscriptionsController`, `SubscriptionsService` |
| `uploads` | Media upload handling (images, PDFs) | `UploadsController`, `UploadsService` |
| `public` | Public‑facing endpoints that do not require auth (e.g., menu browsing) | `PublicController` |
| `tenant` | Multi‑tenant resolution middleware and utilities | `TenantMiddleware`, `TenantService` |
| `audit` | Audit logging of entity changes | `AuditService` |
| `queue` | Background job queue abstraction (Bull, RabbitMQ, etc.) | `QueueService` |
| `gateways` | Integration gateways (payment providers, external APIs) | `PaymentGateway`, `ExternalApiGateway` |
| `common` | Shared utilities, DTOs, pipes, interceptors | N/A |
| `config` | Centralized configuration loader (env variables) | `ConfigService` |
| `context` | Request‑scoped context (current tenant, user) | `RequestContextService` |
| `monitoring` | Health checks, metrics, Prometheus exporter | `MonitoringController` |

All modules are imported in `AppModule` (see `apps/api/src/app.module.ts`). This architecture enables independent development and testing of each domain.

---
*Further detailed docs for each module can be added in `ai-context/` if needed.*
