# Phase 31 Wave 1 — Auth & RBAC Audit

---

## Security Guards & Authorization Audit

- **Authentication Guards**: `JwtAuthGuard` active across protected NestJS controllers.
- **Role-Based Guards**: `@Roles('PLATFORM_ADMIN', 'OWNER', 'MANAGER', 'STAFF', 'DRIVER', 'CUSTOMER')` decorators enforced server-side.
- **Step-Up MFA Guard**: `StepUpAuthGuard` requires second-factor verification before granting access to sensitive healthcare EMR or high-value payment refund routes.
- **Tenant Authorization Guard**: `TenantGuard` extracts tenant ID from verified JWT claims rather than request bodies to prevent horizontal privilege escalation.
