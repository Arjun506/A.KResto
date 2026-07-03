# Memory Rules & Context Sync

This document outlines how context must be synchronized in the `ai-context/` directory to preserve project state across execution environments.

## 1. Context Sync Trigger

Whenever a feature is completed, an architecture rule is revised, or a project decision is reached:
- Update the corresponding file in the `ai-context/` folder.
- Ensure no placeholder values are left in active workspace files.
- Keep `PRISMA_SCHEMA.md` in sync with actual Prisma database schema updates.

## 2. Directory Map

- **Quick_Context.md:** Holds the high-level onboarding brief.
- **Architecture_Summary.md:** Keeps track of the active directory mappings, component trees, and communication rules.
- **Current_Sprint.md / Current_Goals.md:** Tracks upcoming tasks, blockers, and backlog tickets.
- **Completed_Features.md / Pending_Features.md:** Categorizes implementation states.
- **Current_Decisions.md:** Log of Architecture Decision Records (ADR).
- **Known_Issues.md:** Tech debt and bug list.
- **Technology_Stack.md:** List of libraries, utilities, frameworks, and versions.
