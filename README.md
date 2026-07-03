# 💼 AK Business OS (Business Operating System)

Welcome to the **AK Business OS** project repository! This platform is an enterprise-grade multi-tenant operating system designed to run customer-facing, business operations, partner ecosystems, and unified AI capabilities on a highly modular capability architecture.

This project represents the complete design and evolution of the legacy Restaurant SaaS platform into a generic Business OS, enabling runtime capability toggling and custom vertical extensions (Industry Packs).

---

## 🏗️ Repository Layout & Navigation

The repository is structured as a **Turborepo monorepo** with dedicated workspaces. All code, configs, and documentation are strictly organized as follows:

```
.
├── a3-resto-saas/            # Core Platform Subsystem
│   ├── apps/
│   │   ├── api/              # NestJS Backend API Core
│   │   └── web/              # Next.js App Router Frontend Portal
│   ├── packages/             # Common Turborepo utility packages
│   ├── docs/                 # Authoritative Permanent Documentation
│   │   └── archive/          # Archived legacy documents
│   ├── planning/             # Temporary planning, checklists, and TODOs
│   ├── versions/             # Release histories, delivery summaries, and manifests
│   ├── .ai/                  # Developer AI rules, prompts, and personality definitions
│   └── ai-context/           # Active sprint state and dynamic context variables
├── package.json              # Monorepo workspace configuration
├── turbo.json                # Turborepo task runner configuration
└── README.md                 # Project entry point (this file)
```

---

## 🧭 Documentation & Guidelines

All permanent and active document structures live inside [a3-resto-saas/docs/](file:///d:/A3%20resto/a3-resto-saas/docs/). For a full map of files, please visit:
- **[Documentation Index & Map](file:///d:/A3%20resto/a3-resto-saas/docs/README.md)**

For developers and AI agents working on this repository, please review:
- **AI Instructions & Rules:** [a3-resto-saas/.ai/README.md](file:///d:/A3%20resto/a3-resto-saas/.ai/README.md)
- **Active Sprint & Dynamic State:** [a3-resto-saas/ai-context/Quick_Context.md](file:///d:/A3%20resto/a3-resto-saas/ai-context/Quick_Context.md)
- **Engineering Handbook:** [a3-resto-saas/docs/engineering/handbook.md](file:///d:/A3%20resto/a3-resto-saas/docs/engineering/handbook.md)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v10+

### Development Environment Setup

1. **Install Dependencies**
   Run the following command from the root directory:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy the example environment variables file and configure it:
   ```bash
   cp .env.example .env
   ```

3. **Prisma DB Migration & Seed**
   Generate Prisma client and migrate database models:
   ```bash
   npx prisma migrate dev --schema=a3-resto-saas/prisma/schema.prisma
   ```

4. **Start the Monorepo Development Server**
   Start both NestJS API backend and Next.js frontend concurrently via Turborepo:
   ```bash
   npm run dev
   ```
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 🔒 Phase 2 Development Freeze Status

The **documentation, specifications, and architecture layers** are **FROZEN** and standardized in preparation for **Phase 2 (Core Platform Development)**.
All legacy Restaurant SaaS models and previous development logs have been cleaned up and archived. The core specs represent a single source of truth for the upcoming implementation.
