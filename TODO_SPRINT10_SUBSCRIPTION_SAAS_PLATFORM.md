# TODO — Sprint 10: Subscription & SaaS Platform (Business OS)

## DB / Prisma

- [ ] Inspect current Prisma schema + existing subscription models/migrations
- [ ] Extend schema for: plan catalog, usage/feature/module limits, trial expiration, billing history, invoice history
- [ ] Add/adjust enums for subscription lifecycle + plan tiers
- [ ] Create Prisma migration(s) and ensure `prisma generate` compiles

## Backend (NestJS API)

- [ ] Create `billing` / `subscription` module(s)
- [ ] Implement Payment Provider abstraction layer (mock provider only)
- [ ] Implement SubscriptionService: trial creation, status calculation, upgrade/downgrade, usage limit enforcement entrypoints
- [ ] Implement entitlement/limit enforcement integration points with Module Platform + Permission Engine
- [ ] Add Plan Management endpoints (list plans, plan details, update tenant subscription plan)
- [ ] Add Usage Limits endpoints (current usage vs allowed)
- [ ] Add Billing History & Invoice History endpoints
- [ ] Add trial expiration job/cron (or lightweight scheduled/manual mechanism)
- [ ] Wire new module into `AppModule`

## Workspace provisioning integration

- [ ] Update `workspace-provisioning/pipeline/subscription-provisioner.ts` to initialize trial subscription on workspace provisioning completion

## Frontend (NextJS)

- [ ] Add/extend Billing dashboard UI: subscription status, trial, upgrade/downgrade CTA, invoice history
- [ ] Add client service calls to billing/subscription API
- [ ] Gate module actions (minimal UI gating) when subscription not active

## Tests / Verification

- [ ] Unit tests: subscription status transitions, entitlement enforcement
- [ ] Unit tests: payment provider abstraction (mock)
- [ ] Integration tests: key billing/subscription endpoints
- [ ] Run build/lint/tests for api + web
