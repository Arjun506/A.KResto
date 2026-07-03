# Industry Pack #8: Warehouse

## 1. Overview
The Warehouse Pack handles bin locations, picking lists, shipment checks, and carrier tracking logs.

## 2. Core Configurations & Overrides
- **Business Type:** `WAREHOUSE`
- **Visual Extensions:** 3D bin layouts, packing slips, and order picking indicators.
- **Prisma metadata JSONB Mapping:**
  - `binLocation`: Dynamic coordinate identifiers (e.g. Shelf-A-Row-3).
  - `shippingRestrictions`: Temperature thresholds or weight metrics.

## 3. Workflow Modifications
- Automatically generates optimized picking routes based on item locations.
- Automatically calculates shipping carrier fees on check-out transactions.
