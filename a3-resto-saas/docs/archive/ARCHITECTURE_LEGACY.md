# Architecture Overview (Legacy Archive)

*This is a legacy archived copy of the original `docs/ARCHITECTURE.md`. It is preserved for reference only.*

## Backend (NestJS)
- Monorepo using **Turbo** with two main apps: `api` (NestJS) and `web` (Next.js).
- `api` is the core service exposing a REST/GraphQL API. It consists of many feature modules (auth, restaurants, orders, inventory, analytics, etc.) loaded in `AppModule`.
- Each feature lives under `apps/api/src/<feature>` and follows the NestJS pattern of **Module → Controller → Service**.
- Prisma ORM is used for PostgreSQL access (`prisma/schema.prisma`).
- Multi‑tenant support is implemented via the `tenant` module and tenant‑aware services.

## Frontend (Next.js)
- `apps/web` is a Next.js 13+ application (App Router).
- UI components are organized under `apps/web/app/*` (pages) and shared UI under `components`, `hooks`, `context`.
- Uses TailwindCSS, Framer‑Motion, Zustand for state management, and `next-themes` for dark mode.
- Authentication handled via JWT stored in HttpOnly cookies, with Guard on API routes.

## Shared Concepts
- **Authentication**: JWT strategy with Passport, role‑based access via `RolesGuard`.
- **Multi‑Tenant**: Tenant identifier resolved from request headers and injected into services.
- **Dashboard**: Admin UI located in `apps/web/app/dashboard`.
- **POS / QR Ordering**: Separate front‑end routes (`qr-order`, `online-ordering`).

## Data Flow
1. Frontend sends requests with JWT to `/api/*` endpoints.
2. NestJS controllers validate, call services which interact with Prisma.
3. Prisma executes queries against PostgreSQL, returns typed results.
4. Responses are serialized back to the frontend.
