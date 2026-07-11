# Architecture

## Monorepo

- Root uses npm workspaces + Turbo.
- Apps:
  - `apps/api`: NestJS backend
  - `apps/web`: Next.js frontend

## Backend (NestJS)

- `src/app.module.ts` imports feature modules.
- `src/main.ts` sets CORS, global validation pipe, global filters and request logging interceptor.

## Auth

- JWT auth via Passport/Jwt.
- `AuthModule` uses `JwtModule` with `secret: 'super-secret'` and `expiresIn: '7d'`.

## Orders

- Controller uses `JwtAuthGuard`, `TenantGuard`, `RolesGuard`.
- OrdersService uses Prisma + OrdersGateway to emit socket events.

## Frontend

- `AuthProvider` decodes JWT token from localStorage and provides `useAuth()`.
- `services/api.ts` Axios wrapper attaches bearer token.

## TODO

- Document remaining backend module internals (menu/inventory/reservations/uploads/analytics) once inspected.
