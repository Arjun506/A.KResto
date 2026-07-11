# Specification: Purchase Module

## 1. Overview
The Purchase Module manages supplier directories, purchase order logs, reception checks, and invoice validation matches.

## 2. Technical Specifications
- **Table Mapping:** `suppliers`, `purchase_orders`, `purchase_order_items` (Prisma).
- **Core Interfaces:**
  - `createPurchaseOrder(data: CreatePurchaseOrderDto): Promise<PurchaseOrder>`
  - `updateOrderStatus(orderId: string, status: PurchaseStatus): Promise<PurchaseOrder>`
  - `receiveShipment(orderId: string, receivedItems: ReceivedItemDto[]): Promise<void>`

## 3. Endpoints & API Contract
- `POST /api/v1/purchase/orders` - Drafts a new purchase order for a supplier.
- `GET /api/v1/purchase/orders` - Fetches orders, filterable by state (draft, sent, received).
- `POST /api/v1/purchase/orders/:id/receive` - Confirms shipment reception, updating stock.
