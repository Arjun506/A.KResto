# Business Foundation Architecture Specification

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

The Business Foundation publishes the following events:
- `business.created`
- `business.updated`
- `business.status.changed`
- `business.verified`
- `business.deleted`
- `business.ownership.transferred`
- `business.relationship.created`
- `business.address.added`
- `business.attachment.uploaded`

### Multi-Tenant Isolation

All Business Foundation records tie to `tenantId` and enforce `TenantGuard` validation on HTTP requests.
