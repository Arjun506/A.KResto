# Customer Foundation Architecture Specification

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

The Customer Foundation publishes the following events:
- `customer.registered`
- `customer.profile.updated`
- `customer.status.changed`
- `customer.lifecycle.changed`
- `customer.verified`
- `customer.merged`
- `customer.consent.updated`
- `customer.preferences.updated`
- `customer.address.added`
- `customer.contact.added`
- `customer.group.assigned`
- `customer.tag.added`
- `customer.relationship.created`
- `customer.communication.sent`
- `customer.archived`
- `customer.reactivated`
- `customer.deleted`

### Multi-Tenant Isolation

All Customer Foundation records tie to `tenantId` and enforce `TenantGuard` validation on HTTP requests.
