# Business OS Core Modules

This document details the generic platform services provided by the Business OS Core layer.

## Reusable Services

### 1. Authentication & Session Manager (`auth/`)
- Handles secure login via Username/Email/Phone.
- Supports Two-Factor Authentication (2FA) and authenticator App configurations.
- Enforces active session expirations and session audits.

### 2. Multi-Tenancy Router (`tenant/`)
- Isolates all queries automatically based on `tenantId` (derived from the JWT restaurantId scope).
- Enforces database constraints via Prisma transactional contexts.

### 3. Permissions & RBAC Engine (`permissions/`)
- Connects endpoint guards (`PermissionsGuard`) and UI items to custom roles mapped in the `roles_permissions` database table.
- Dynamically hides elements using the client-side `hasPermission` auth hook.

### 4. Billing & Subscription engine (`payment/` & `subscription/`)
- Exposes gateway checkouts (Stripe, Razorpay, PayPal) and billing portal links.
- Tracks active subscription quotas (seats allocated, branch limits, storage limits).

### 5. Audit Log System (`audit/`)
- Captures all database creations, edits, auth logins, and permissions updates in the `audit_logs` table.
