# Security Policy

This document presents the security protocols and compliance benchmarks for **AK Business OS**.

## 1. Authentication & JWT Policies

- **Token Storage:** JWT tokens must be stored in HTTP-only, secure, same-site cookies to minimize XSS hijack vulnerabilities.
- **Expiration Framework:** Short token lifespans (e.g. 15 minutes) backed by secure database-stored refresh tokens.
- **Signature Security:** Secure JWT keys fetched dynamically from environment variables, rotating at scheduled intervals.

## 2. Multi-Tenant Data Isolation

- **Middleware Checks:** A global `TenantGuard` verifies every inbound request contains a valid tenant header or cookie payload.
- **SQL / Prisma Constraints:** All query layers must filter databases by `tenantId`. Write unit tests to check that no cross-tenant actions succeed.
- **Dynamic Feature Flags:** The `FeatureGuard` blocks requests targeting inactive capabilities, preventing data exposure.

## 3. Rate Limiting & Validation

- **Rate Limits:** Enforce throttling filters (e.g. max 100 requests per minute per IP/tenant) globally, with exceptions for high-frequency webhooks.
- **Input Sanitization:** Guard controllers against SQL injection and XSS payloads by strict validation using `class-validator`.
