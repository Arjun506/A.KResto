# Phase 31 Wave 1 — Data Domain Matrix

---

## Prisma Data Domain Classification

| Domain | Key Models | Model Status | Tenant Scoped | Index Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Identity & Access** | `User`, `Account`, `Session`, `Role`, `Permission` | `MODEL_COMPLETE` | Yes | Low |
| **Tenant & Business** | `Tenant`, `Organization`, `Business`, `Location` | `MODEL_COMPLETE` | Yes | Low |
| **Catalog & Products** | `Product`, `Category`, `Variant`, `Modifier` | `MODEL_COMPLETE` | Yes | Low |
| **Orders & Commerce** | `Order`, `OrderItem`, `Transaction`, `Payment` | `MODEL_COMPLETE` | Yes | Low |
| **Inventory & Warehouse**| `InventoryItem`, `StockMovement`, `Warehouse` | `MODEL_COMPLETE` | Yes | Low |
| **Customer & CRM** | `Customer`, `SupportTicket`, `LoyaltyPoint` | `MODEL_COMPLETE` | Yes | Low |
| **Industry Extensions** | `Room`, `Appointment`, `Shipment`, `WorkOrder` | `MODEL_PARTIAL` | Yes | Low |
