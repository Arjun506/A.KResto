# Industry Pack #7: Manufacturing

## 1. Overview
The Manufacturing Pack handles bill of materials (BOM), production runs, and raw material tracking.

## 2. Core Configurations & Overrides
- **Business Type:** `MANUFACTURING`
- **Visual Extensions:** BOM layout trees, work order cards, and machinery monitors.
- **Prisma metadata JSONB Mapping:**
  - `materialSafetySheet`: Reference URLs to safety documentation.
  - `machineCalibrations`: Log metrics for equipment settings.

## 3. Workflow Modifications
- Automatically deducts raw ingredients from inventory when a production run starts.
- Calculates quality control stages during production updates.
