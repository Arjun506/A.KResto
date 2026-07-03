# Architecture Overview

This document presents the technical architecture of the **AK Business OS** monorepo.

## 1. Monorepo Structure

```
a3-resto-saas/
├─ apps/
│  ├─ api/          # NestJS core backend services
│  └─ web/          # Next.js App Router UI frontend
├─ libs/            # Shared capability modules & industry packs
│  ├─ capabilities/ # CRM, POS, HRMS, etc.
│  └─ industry-packs/ # Restaurant, Retail, Hotel overrides
├─ packages/        # Common utilities, constants, DTO schemas
└─ docs/            # Engineering specifications & roadmap
```

## 2. Request Lifecycle & Routing

```
Client Requests (HTTP/GraphQL)
   │
   ▼
[NextJS Client Web UI]
   │
   ▼ (REST/GraphQL with JWT Headers)
[NestJS API AppModule]
   │
   ├─► [JwtAuthGuard] (Authenticates token context)
   ├─► [TenantGuard] (Resolves Tenant Context)
   └─► [FeatureGuard] (Validates Capability activation in Tenant Registry)
   │
   ▼
[Feature Module Controller] (e.g. POSController)
   │
   ▼
[Feature Module Service] (Queries DB through Prisma, scoped strictly to tenantId)
```

## 3. Modular Capability Guards

- **Tenant Isolation:** Active tenant state is parsed from HTTP request headers or cookies. Service calls explicitly scope operations to `tenantId`.
- **Feature Flag System:** Dynamic capability checks block requests targeting inactive modules, returning `403 Forbidden` responses.
