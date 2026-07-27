# Phase 29 — Migration Chain Audit

This report documents the forensic analysis of all historical migration SQL files.

---

## 1. Migration Step Audit Mappings

1. **`20260528205246_add_roles`**: 
   - **Expectations**: Empty database.
   - **Actions**: Creates `restaurants`, `users`, `orders`, `tables`, `categories`, `menu_items`, `order_items`, `subscriptions` tables.
2. **`20260703214432_rename_restaurants_to_tenant`**:
   - **Expectations**: `restaurants` table exists (from M1).
   - **Actions**: Creates `tenant_features`, `audit_logs`, `inventory_items`, `suppliers`, `purchase_orders`, `purchase_order_items`, `reservations`, `menu_item_variants`, `menu_item_addons`.
3. **`20260703230209_add_branch_and_roles_permissions`**:
   - **Expectations**: `restaurants` exists.
   - **Actions**: Creates `branches`, `roles_permissions` tables.
4. **`20260703230834_add_tenant_status`**:
   - **Expectations**: `restaurants` exists.
   - **Actions**: Adds `status` column to `restaurants` table.
5. **`20260703_add_business_os_foundation`**:
   - **Expectations**: `branches` table exists (created by M3), `restaurants.status` exists (created by M4), `tenant_features` exists (created by M2), `audit_logs` exists (created by M2).
   - **Actions**: Alters `restaurants.status` type to enum `TenantStatus`, extends `branches`, adds `config` to `tenant_features`.
6. **`20260703_fix_branch_index`**:
   - **Expectations**: `branches` table exists and contains columns added by M5.
   - **Actions**: Replaces unique index on `branches`.
7. **`20260710_order_to_cash_inventory`**:
   - **Expectations**: Core DB structure complete.
   - **Actions**: Creates `menu_item_ingredients` and `inventory_movements`.
