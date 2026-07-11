# Specification: Inventory Module

## 1. Overview
The Inventory Module manages inventory items, low-stock notifications, unit conversions, and location tracking.

## 2. Technical Specifications
- **Table Mapping:** `inventory_items` (Prisma).
- **Core Interfaces:**
  - `adjustStock(itemId: string, adjustment: number): Promise<InventoryItem>`
  - `checkLowStock(tenantId: string): Promise<InventoryItem[]>`
  - `registerItem(data: RegisterInventoryItemDto): Promise<InventoryItem>`

## 3. Endpoints & API Contract
- `POST /api/v1/inventory/items` - Registers a new inventory item in the warehouse log.
- `GET /api/v1/inventory/items` - Fetches item details, filterable by low stock.
- `PATCH /api/v1/inventory/items/:id/stock` - Modifies inventory counts (add, subtract).
