# Codebase Migration & Decoupling Plan

This document details the step-by-step strategy for decoupling existing Restaurant logic into its separate industry pack bundle without causing regressions.

## Step 1: Audit & Identify Boundaries
- Categorize existing models and directories.
- Identify restaurant-specific routes:
  - `/dashboard/restaurant-operations`
  - `/dashboard/qr-tables`
  - `/dashboard/menu`
  - `/dashboard/kitchen`
  - `/dashboard/reservations`
  - `/dashboard/pos` (Hospitality layouts)

## Step 2: Establish the Module Registry
- Ensure that universal features like raw stock lists or simple billing counters are registered under the generic `modules/` list.
- Keep restaurant-specific items (like ingredients/variant models) locked under `industry-packs/restaurant/`.

## Step 3: Decouple Shared Interfaces
- Remove any reference to `Restaurant` or `restaurantId` in the core platform layers, swapping them with `Tenant` and `tenantId` (e.g. as completed in the `TenantGuard`).

## Step 4: Component Relocation
- Move restaurant-specific pages and helpers into the `industry-packs/restaurant/` folder structure, updating the build configurations (`tsconfig` and monorepo workspaces paths) accordingly.
- Keep core routing maps clean of pack imports.
