# Phase 29 — Migration Dependency Graph

This document mapping outlines the logical dependencies of the database migrations.

---

## 1. Dependency Graph

```mermaid
graph TD
    M1["1. 20260528205246_add_roles (Creates core tables: restaurants, users)"]
    
    M2["2. 20260703214432_rename_restaurants_to_tenant"] -->|Depends on| M1
    M3["3. 20260703230209_add_branch_and_roles_permissions"] -->|Depends on| M1
    M4["4. 20260703230834_add_tenant_status"] -->|Depends on| M1
    
    M5["5. 20260703_add_business_os_foundation"] -->|Depends on| M2
    M5 -->|Depends on| M3
    M5 -->|Depends on| M4
    
    M6["6. 20260703_fix_branch_index"] -->|Depends on| M5
    
    M7["7. 20260710_order_to_cash_inventory"] -->|Depends on| M6
```

---

## 2. Inherent Mismatches in Active History

Prisma CLI orders migrations by parsing their folder prefix timestamps as integers. 
- `20260703` (8 digits) is evaluated as a smaller number than `20260703214432` (14 digits).
- Consequently, Prisma attempts to execute `20260703_add_business_os_foundation` *before* the migrations that create the `branches` and `status` columns, causing execution failure.
