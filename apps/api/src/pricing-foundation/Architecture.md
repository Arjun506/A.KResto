# Pricing Foundation Architecture Specification

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

### Rule Precedence Hierarchy

```
1. Customer Specific Overrides (Score 100)
2. B2B Corporate Contracts (Score 90)
3. Promotional Discounts & Coupons (Score 80)
4. Regional Zone Overrides (Score 70)
5. Multi-Channel Rates (Score 60)
6. Quantity Tier Breaks (Score 50)
7. Standard Base List Price (Score 10)
```

### Domain Event Stream

- `pricing.book.created`
- `pricing.list.created`
- `pricing.rule.created`
- `pricing.calculated`
- `pricing.changed`
- `pricing.activated`
- `pricing.expired`
- `pricing.promotion.started`
- `pricing.promotion.ended`
- `pricing.discount_policy.updated`
- `pricing.version.created`
- `pricing.published`
- `pricing.rejected`
- `pricing.simulation.executed`
- `pricing.coupon.created`
- `pricing.exchange_rate.updated`

### Multi-Tenant Isolation

All Pricing Foundation records tie to `tenantId` and enforce `TenantGuard` validation on HTTP requests.
