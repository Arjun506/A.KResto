# Repository Folder Structure

The authoritative directory structure of the **AK Business OS** monorepo is outlined below:

```
d:/A3 resto/                  # Workspace Root / Git Repository
├─ a3-resto-saas/             # Core Platform Directory
│  ├─ apps/                   # Application projects
│  │  ├─ api/                 # NestJS backend application
│  │  │  ├─ src/              # Application source code
│  │  │  │  ├─ auth/          # JWT, Role Guards, login/register logic
│  │  │  │  ├─ tenant/        # Multi-tenant resolution utilities
│  │  │  │  ├─ orders/        # Orders, billing, status state machine
│  │  │  │  ├─ inventory/     # Inventory, SKU, stock management
│  │  │  │  ├─ crm/           # CRM, contact, interactions management
│  │  │  │  ├─ analytics/     # Reporting aggregations, text-to-SQL
│  │  │  │  ├─ common/        # Shared decorators, interfaces, DTOs
│  │  │  │  └─ ...            # Additional domain modules
│  │  ├─ web/                 # Next.js App Router frontend app
│  │  │  ├─ app/              # Web pages and routes
│  │  │  │  ├─ dashboard/     # Role-based dashboards (Billing, Chef, etc.)
│  │  │  │  ├─ login/         # Redesigned Role-based login portal
│  │  │  │  ├─ onboarding/    # Setup wizard for new business registration
│  │  │  │  └─ ...            # Customer, booking, and storefront portals
│  ├─ packages/               # Common shared library packages
│  ├─ docs/                   # Authoritative Permanent Documentation
│  │  ├─ product/             # Vision, blueprints, personas
│  │  ├─ architecture/        # Architecture overview, request lifecycle
│  │  ├─ business-os-engines/ # Specifications for the foundational engines
│  │  ├─ specifications/      # Module-level technical specifications
│  │  ├─ consumer-platform/   # Single identity, web/mobile storefronts
│  │  ├─ developer-platform/  # SDK templates, webhooks, sandbox API
│  │  ├─ ai-platform/         # Central AI service registry, forecasts
│  │  ├─ industry-packs/      # Vertical custom presets (Restaurant, Retail, etc.)
│  │  ├─ design-system/       # UI/UX tokens, typography, Resto Premium design
│  │  ├─ engineering/         # Coding, folder, database, naming standards
│  │  ├─ operations/          # Infrastructure deploy instructions, handbooks
│  │  ├─ roadmap/             # Milestones, epics, sprint planning
│  │  └─ archive/             # Obsolete specifications and legacy root documents
│  ├─ planning/               # Temporary planning, checklists, and TODO trackers
│  ├─ versions/               # Historical release manifests, strategic summaries
│  ├─ .ai/                    # AI agent instructions, rules, prompts
│  └─ ai-context/             # Active sprint state, current decisions, schema snapshots
├─ package.json               # Monorepo configuration
├─ turbo.json                 # Turborepo task orchestrator
└─ README.md                  # Project entry point and navigation map
```
