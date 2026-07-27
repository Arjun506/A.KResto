# Product Foundation Architecture Specification

## Clean Architecture & Bounded Contexts

```
[ HTTP Controllers / Swagger ]
              │
              ▼
    [ Service Layer ] ───► Emits Domain Events (EventBusService)
              │       └───► Logs Audit Trail (AuditService)
              ▼
   [ Repository Layer ]
              │
              ▼
   [ Prisma / PostgreSQL ]
```

### Domain Event Stream

The Product Foundation publishes the following events:
- `product.created`
- `product.updated`
- `product.published`
- `product.version.created`
- `product.relationship.created`
- `product.localized`
- `product.visibility.changed`
- `product.archived`
- `product.activated`
- `product.category.assigned`
- `product.price.changed`
- `product.media.added`
- `product.variant.created`
- `product.bundle.created`
- `product.deleted`

### Multi-Tenant Isolation

All Product Foundation records tie to `tenantId` and enforce `TenantGuard` validation on HTTP requests.
