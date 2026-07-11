# Roadmap: Epics

This document maps system enhancements to major thematic feature bundles (Epics).

## Epic 1: Generic Capability Infrastructure
- **Objective:** Redesign the monolith from a single-industry Restaurant SaaS into a capability-based monorepo layout.
- **Child Stories:**
  - Scaffold `libs/capabilities/` and `libs/industry-packs/`.
  - Build dynamic module loader handlers.
  - Implement `FeatureGuard` controller filters.

## Epic 2: Unified POS & Checkout
- **Objective:** Create a reusable checkout engine that acts as a generic Point of Sale for all industry packs.
- **Child Stories:**
  - Refactor basket pricing to handle dynamic taxes.
  - Integrate cash drawer session validations.
  - Link inventory depletion routines.

## Epic 3: Unified AI Analytics
- **Objective:** Launch text-to-SQL querying and predictive stock forecasting.
- **Child Stories:**
  - Build NL query parsers.
  - Integrate stock run-out alert triggers.
