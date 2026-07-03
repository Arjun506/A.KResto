# Quick Context

This file provides a high-level overview of the **AK Business OS** project.

## 1. Project Background

Originally built as a specialized Restaurant SaaS dashboard, the project is undergoing a transition to a generic, multi-tenant Business Operating System (Business OS). The core system handles common business operational logic (onboarding, payments, CRM, document management) with capability feature toggles.

## 2. Core Pillars

- **Modular Business Engine:** Base framework managing tenants, licenses, capabilities, and settings.
- **Industry Packs:** Customizable extensions (e.g. Restaurant, Retail, Salon, Hotel) that sit on top of the Business Engine.
- **Consumer Portal:** User-facing apps (like QR ordering, checkouts, and customer accounts).
- **Developer Platform:** Reusable APIs, packages, SDKs, and webhook configurations to extend core services.
- **Unified AI System:** Inline tools, analytics, text-to-SQL dashboards, and automated suggestions.

## 3. Directory Layout

- `apps/api/` - NestJS backend.
- `apps/web/` - Next.js frontend app router.
- `libs/` - Modular capabilities and industry-specific plugins.
- `docs/` - Multi-layered specification suite.
- `.ai/` - AI rules and developer directives.
- `ai-context/` - Active sprint trackers.
