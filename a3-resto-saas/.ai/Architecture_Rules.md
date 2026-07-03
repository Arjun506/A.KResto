# Architecture Rules & Structural Directives

This document establishes the architecture rules that govern the transition from Restaurant SaaS to a modular Business Operating System.

## 1. Modularity Rules

- **Module Independence:** Capabilities must be self-contained modules. They should reside under `libs/capabilities/` or their respective backend feature domains.
- **Dynamic Registrations:** Use Dynamic Modules in NestJS to load and unload industry-specific features based on tenant context.
- **No Direct Table References:** Never perform database joins across different capability boundaries (e.g. do not join a table from `Inventory` directly into an `Authentication` query). Instead, query through services or emit/consume event payloads.

## 2. Capability Registry & Feature Guard

- **Feature Guard:** Any incoming request targeting a capability must go through a `FeatureGuard` that resolves the active tenant, checks enabled features, and blocks request access if the feature is disabled.
- **Polymorphic Entities:** Use generic schemas with customizable attributes (e.g. JSONB columns) instead of hardcoding business-specific properties onto core domain models.

## 3. Monorepo Organization

- **Turborepo Boundaries:** Maintain the boundary between `apps/api/` (NestJS) and `apps/web/` (Next.js App Router).
- **Packages & Shared Libs:** Shared types, helper classes, and configuration templates belong in `packages/` or `libs/`. Apps must import them dynamically via Turborepo linkages.
