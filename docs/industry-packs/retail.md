# Industry Pack #2: Retail

## 1. Overview
The Retail Pack optimizes core capabilities for barcode checkouts, retail inventory, and physical store locations.

## 2. Core Configurations & Overrides
- **Business Type:** `RETAIL`
- **Visual Extensions:** Catalog lists optimized for barcode scans, stock indicators, and customer segment widgets.
- **Prisma metadata JSONB Mapping:**
  - `sku`: Distinct stock keeping unit indicators.
  - `upc`: Universal Product Code labels.
  - `returnPolicy`: Text definitions of store return terms.

## 3. Workflow Modifications
- Integrates POS checkouts with automatic stock updates in the Warehouse module.
- Generates customer loyalty points on transaction checkouts.
