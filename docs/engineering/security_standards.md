# Engineering Standard: Security Standards

## 1. Authentication Security

- **Storage:** Secure user tokens in HTTP-only, secure, same-site cookies to minimize cookie theft via cross-site scripting (XSS).
- **Password Hashing:** Hash passwords using **bcrypt** with a minimum work factor (salt rounds) of 10.
- **Sensitive Data:** Never return password hashes, refresh tokens, or security keys in API response payloads. Use Prisma projection select maps.

## 2. Multi-Tenant Isolation

- **Middleware Enforcement:** Intercept all API calls with a `TenantGuard` that extracts the `tenantId` from request headers or cookies.
- **Prisma Scoping:** Every database write, read, or delete operation must include the `tenantId` parameter. Never rely on client-side state for authorization.
- **Access Verification:** All endpoints must be decorated with `@UseGuards(RolesGuard)` or checking permissions to verify role access.
