# Phase 31 Wave 4 — Inventory Engine

---

## Universal Inventory Architecture

- **Stock Quantity Model**:
  ```
  AVAILABLE = ON_HAND - RESERVED
  ```
- **Concurrency & Idempotency**: Stock deductions execute within Prisma transactions (`$transaction`) and deduplicate repeated order calls using order reference keys.
- **Tenant Scope Enforcement**: All stock queries enforce tenant and location boundaries (`where: { tenantId, locationId }`).
