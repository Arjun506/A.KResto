# Industry Pack #9: Corporate

## 1. Overview
The Corporate Pack configures employee directories, corporate assets, and contract logs.

## 2. Core Configurations & Overrides
- **Business Type:** `CORPORATE`
- **Visual Extensions:** Organizational charts, asset inventory catalogs, and contract templates.
- **Prisma metadata JSONB Mapping:**
  - `department`: Corporate unit tags (e.g. Engineering, Sales).
  - `costCenter`: Internal accounting IDs.

## 3. Workflow Modifications
- Automatically generates asset logs when hardware is assigned to employees.
- Triggers contract review reminders 30 days before expiration.
