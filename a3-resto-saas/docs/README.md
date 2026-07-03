# 🗺️ AK Business OS – Documentation Map & Index

Welcome to the central documentation index for the **AK Business OS** platform. This directory contains the frozen, production-ready specifications, design guidelines, and architectural blueprints for the system.

---

## 🧭 Master Documentation Map

Below is the authoritative directory layout and index mapping where every topic belongs.

| Category / Directory | Source File Path | Purpose & Topic Scoped |
| :--- | :--- | :--- |
| **Product & Vision** | [docs/product/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/product/overview.md) | Platform vision, core pillars, target user personas. |
| | [docs/product/blueprint.md](file:///d:/A3%20resto/a3-resto-saas/docs/product/blueprint.md) | The complete, high-level blueprint for all 23 platform modules. |
| **Architecture** | [docs/architecture/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/architecture/overview.md) | Monorepo layout, request lifecycle, routing, and tenant isolation. |
| **Business OS Engines** | [docs/business-os-engines/business-engine/index.md](file:///d:/A3%20resto/a3-resto-saas/docs/business-os-engines/business-engine/index.md) | Base capability registry, tenant settings, and onboarding. |
| **Specifications (Core)** | [docs/specifications/module_engine.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/module_engine.md) | Spec for runtime loading, dependency resolver, and feature flags. |
| | [docs/specifications/permission_engine.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/permission_engine.md) | Spec for RBAC / ABAC matrix, policy engine, and endpoint checks. |
| | [docs/specifications/payment_tracking.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/payment_tracking.md) | Spec for payment flow, checkout integrations, and reconciliation. |
| | [docs/specifications/authentication.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/authentication.md) | Spec for JWT token scopes, identity resolver, and SSO integration. |
| | [docs/specifications/accounting.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/accounting.md) | Spec for general ledger, chart of accounts, and financial journal entries. |
| | [docs/specifications/crm.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/crm.md) | Spec for contact management, timelines, and feedback loops. |
| | [docs/specifications/pos.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/pos.md) | Spec for brick-and-mortar register UI checkpoints and local cache. |
| | [docs/specifications/inventory.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/inventory.md) | Spec for warehouse SKU tracking, stock replenishment, and depletion warnings. |
| | [docs/specifications/hrms.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/hrms.md) | Spec for employee scheduling, shift check-ins, and org chart permissions. |
| | [docs/specifications/payroll.md](file:///d:/A3%20resto/a3-resto-saas/docs/specifications/payroll.md) | Spec for global jurisdictions tax calculations and salary runs. |
| **Consumer Platform** | [docs/consumer-platform/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/consumer-platform/overview.md) | Universal customer identity, QR table portal, search results, and maps. |
| **Developer Platform** | [docs/developer-platform/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/developer-platform/overview.md) | SDK specs, CLI commands, mock sandbox, and webhook configurations. |
| **Marketplace** | [docs/marketplace/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/marketplace/overview.md) | Add-on package structures, pricing schedules, and sandboxing lifecycles. |
| **AI Platform** | [docs/ai-platform/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/ai-platform/overview.md) | Central AI service registry, NLP conversion to SQL, and agent definitions. |
| **Industry Packs** | [docs/industry-packs/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/industry-packs/overview.md) | Declarative pack structure, overrides system, and tenant configuration. |
| | [docs/industry-packs/restaurant.md](file:///d:/A3%20resto/a3-resto-saas/docs/industry-packs/restaurant.md) | Restaurant pack customization manifest and KDS/Table workflows. |
| | [docs/industry-packs/retail.md](file:///d:/A3%20resto/a3-resto-saas/docs/industry-packs/retail.md) | Retail pack overrides, promotions, and barcode configuration. |
| **API Reference** | [docs/api/index.md](file:///d:/A3%20resto/a3-resto-saas/docs/api/index.md) | Public and internal API design standards, rate limits. |
| | [docs/api/integration_guide.md](file:///d:/A3%20resto/a3-resto-saas/docs/api/integration_guide.md) | Detailed developer integration walkthrough. |
| | [docs/api/backend_implementation.md](file:///d:/A3%20resto/a3-resto-saas/docs/api/backend_implementation.md) | NestJS controller interfaces, request-response validation. |
| **Design System** | [docs/design-system/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/design-system/overview.md) | Color tokens, typography metrics, grid spacing, and responsive breakpoints. |
| | [docs/design-system/premium_design_guide.md](file:///d:/A3%20resto/a3-resto-saas/docs/design-system/premium_design_guide.md) | Glassmorphism, animations, and premium dark/gold theme details. |
| **Engineering Standards** | [docs/engineering/handbook.md](file:///d:/A3%20resto/a3-resto-saas/docs/engineering/handbook.md) | General engineering rules and directory workflows. |
| | [docs/engineering/coding_standards.md](file:///d:/A3%20resto/a3-resto-saas/docs/engineering/coding_standards.md) | TypeScript, linting, code structures, and refactoring guidelines. |
| | [docs/engineering/database_standards.md](file:///d:/A3%20resto/a3-resto-saas/docs/engineering/database_standards.md) | Prisma schemas, migration rules, and multi-tenant schema safety. |
| **Operations** | [docs/operations/handbook.md](file:///d:/A3%20resto/a3-resto-saas/docs/operations/handbook.md) | Production infrastructure setup, Docker Compose, monitoring guidelines. |
| **Roadmaps** | [docs/roadmap/overview.md](file:///d:/A3%20resto/a3-resto-saas/docs/roadmap/overview.md) | Milestone checklists and execution roadmap for Phase 2/3. |
| **Archives (Legacy)** | [docs/archive/](file:///d:/A3%20resto/a3-resto-saas/docs/archive/) | Obsolete blueprints, legacy specs, and old A3 Resto outlines. |

---

## 🔒 Document Control & Verification Rules
1. **Single Source of Truth:** Duplicate entries have been merged into the respective overview files.
2. **Archival over Deletion:** Legacy files have been appended with `_LEGACY` and stored in [docs/archive/](file:///d:/A3%20resto/a3-resto-saas/docs/archive/) to preserve developer reasoning.
3. **No Code Pollution:** The root of the repository only contains project workspace configurations. Permanent documentation lives exclusively inside `docs/`.
