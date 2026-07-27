# AK OS 2035 - Kernel Foundation (Production Ready)

The **AK OS Kernel Engine** is the enterprise core operating intelligence platform for AK OS. It connects Businesses, Tenants, Organizations, IAM, Audit, Caching, Event Bus, Search, File Platform, and Notifications into a single multi-tenant infrastructure.

## Architecture & Core Modules

- **Authentication (`/auth`)**: JWT issuance, Refresh Tokens, Password Hashing, 2FA, Session revocation. Protected by rate limiting (`@nestjs/throttler`).
- **IAM (`/iam`)**: Identity & Access Management for Users, Profiles, User Groups, Claims, Access Policies, and Soft Deletion (`deletedAt`).
- **Tenant (`/tenants`)**: Multi-tenant CRUD, Custom Domains, Branding, Limits, Feature Flags, Subscriptions, and Global Tenant Isolation (`TenantGuard`).
- **Organization (`/organizations`)**: Generic enterprise tree (`Organization` ➔ `Business` ➔ `Division` ➔ `Location` ➔ `Department` ➔ `Team`).
- **Permissions (`/permissions`)**: Granular RBAC/ABAC role & permission matrix.
- **Event Bus Platform (`src/event-bus`)**: Decoupled RxJS domain event emitter emitting `UserCreated`, `TenantCreated`, `RoleAssigned`, `PermissionUpdated`, `LoginSucceeded`, `PasswordChanged`.
- **Notification Platform (`src/notification-platform`)**: Channel adapter interfaces for `EMAIL`, `SMS`, `PUSH`, `IN_APP`, and `WEBHOOK`.
- **File Platform (`src/file-platform`)**: Storage provider abstraction (`IStorageDriver`) with `LocalStorageDriver` and signed URLs.
- **Search Platform (`src/search`)**: Unified pagination, query builder, and search result formatting.
- **Cache Module (`src/cache`)**: Key-value caching abstraction supporting TTLs and domain key prefixes.
- **Platform Settings (`src/platform-settings`)**: Multi-tier configuration (`SYSTEM`, `TENANT`, `ORGANIZATION`, `USER`).
- **Audit Platform (`src/audit`)**: System-wide immutable audit trail.
- **Health Probes (`/health`)**: Terminus `/health/liveness` and `/health/readiness`.

## Security & Tenant Isolation

1. **Global Tenant Isolation**: All non-public endpoints require `x-tenant-id` header or an authenticated user tenant context. Unauthenticated/public routes explicitly use `@PublicTenant()`.
2. **Rate Limiting**: Critical auth endpoints use `@Throttle({ default: { limit: 5, ttl: 60000 } })`.
3. **Soft Delete**: Core records set `deletedAt` timestamp upon deletion and are automatically excluded from query results.

## Developer Quickstart

```powershell
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Run Unit Tests
npm run test

# 4. Build Production Bundle
npm run build
```

OpenAPI Swagger Documentation: `http://localhost:3001/api/docs`
