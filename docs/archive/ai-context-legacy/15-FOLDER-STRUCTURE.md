# Folder Structure

## Root

- Monorepo/workspaces
- `a3-resto-saas/` contains apps and deployment files.

## `a3-resto-saas/apps/api`

- NestJS backend
- `src/` includes:
  - `auth/`, `orders/`, `menu/`, `inventory/`, `reservations/`, `restaurants/`, `uploads/`, `analytics/`, `public/`
  - `common/` (guards/filters/interceptors/responses/types)
  - `gateways/` (Socket.io)
  - `prisma/` (PrismaService)

## `a3-resto-saas/apps/web`

- Next.js frontend
- `app/` includes:
  - `login/`, `dashboard/` and role dashboards
- `components/` includes:
  - `protected-route.tsx`, theme provider, providers, dashboard components
- `context/` includes:
  - `auth-context.tsx`, `notification-context.tsx`
- `services/` includes:
  - Axios `api.ts`, domain services, `socket.ts`

## AI Memory

- `ai-context/` (this folder) contains permanent documentation.
