# Phase 31 Wave 1 — Backend Module Registry

---

## NestJS Subdirectory & Module Classification (56 Modules)

| Module Directory | Primary Responsibility | Data Models | Classification |
| :--- | :--- | :--- | :--- |
| `src/auth` | User registration, authentication, JWT tokens, OTP | `User`, `Account` | `PRODUCTION_IMPLEMENTED` |
| `src/tenant` | Multi-tenant organization provisioning | `Tenant`, `Organization` | `PRODUCTION_IMPLEMENTED` |
| `src/business` | Business entity CRUD & multi-location setup | `Business`, `Location` | `PRODUCTION_IMPLEMENTED` |
| `src/security` | Step-Up MFA, encryption, security audit logs | `SecurityAudit` | `PRODUCTION_IMPLEMENTED` |
| `src/super-admin` | Platform administration & pilot management | `Pilot`, `Subscription` | `PRODUCTION_IMPLEMENTED` |
| `src/restaurants` | Restaurant reference pack APIs (POS, KDS, Tables) | `Restaurant`, `Table`, `KDS` | `PRODUCTION_IMPLEMENTED` |
| `src/saas-commerce`| Catalog, Orders, Pricing, Checkout Engine | `Product`, `Order`, `OrderItem` | `PRODUCTION_IMPLEMENTED` |
| `src/inventory` | Stock movements, warehouse management, POs | `InventoryItem`, `Warehouse` | `PRODUCTION_IMPLEMENTED` |
| `src/crm-foundation` | Customer profiles, leads, support tickets, loyalty | `Customer`, `SupportTicket` | `PRODUCTION_IMPLEMENTED` |
| `src/payment` | Payment intent processing, Stripe sandbox adapter | `PaymentIntent`, `Transaction` | `PRODUCTION_IMPLEMENTED` |
| `src/notification-platform` | In-app alerts, email processor, SMS processor | `Notification` | `PRODUCTION_IMPLEMENTED` |
| `src/queue` | BullMQ queues, processors, isolation guards | Queue Job Handlers | `PRODUCTION_IMPLEMENTED` |
| `src/ai-platform` | AI Copilot gateway, prompt registry, safety gates | `AiPrompt`, `AiMemory` | `PRODUCTION_IMPLEMENTED` |
| `src/search` | Platform-wide search service | Search Indices | `PRODUCTION_IMPLEMENTED` |
| `src/file-platform` | S3 / R2 compatible file uploads & presigned URLs | `FileMetadata` | `IMPLEMENTED_UNVERIFIED` |
| `src/industry-packs` | Hotel, Healthcare, Logistics, Retail pack modules | Industry Entities | `PARTIAL` |
