# SaaS Commercialization Platform Architecture

The module utilizes the existing core database models (`Tenant`, `subscriptions`, `tenant_features`) without schema modifications.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │             SaaS Commercialization Module           │
  ├─────────────────────────────────────────────────────┤
  │   Onboarding, Entitlements, Metering, Webhooks      │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │  Platform Engines   │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Reuse
The SaaS module orchestrates core resources:
- User/Employee: Checked for seat license limitations.
- Payment/Pricing: Invoked for upgrade payments and prorations.
- Event Bus: Used for emitting SaaS lifecycle events.
