# Database Models (Legacy Archive)

*This is a legacy archived copy of the original `docs/DATABASE_MODELS.md`. It is preserved for reference only.*

The project uses **Prisma ORM** with a PostgreSQL datasource. Below is a concise overview of the main models and their key relations.

| Model | Primary Key | Important Fields | Relations |
|-------|-------------|------------------|-----------|
| `restaurants` | `id` (cuid) | `name`, `slug`, `currency`, `timezone`, `isActive` | has many `categories`, `menu_items`, `orders`, `inventory_items`, `reservations`, `tables`, `users`, `audit_logs`, `subscriptions`, `suppliers`, `purchase_orders` |
| `categories` | `id` | `restaurantId`, `name`, `sortOrder` | belongs to `restaurants`; has many `menu_items` |
| `menu_items` | `id` | `restaurantId`, `categoryId?`, `name`, `price`, `isAvailable` | belongs to `restaurants`; optional belongs to `categories`; has many `menu_item_variants`, `menu_item_addons`, `order_items` |
| `menu_item_variants` | `id` | `restaurantId`, `menuItemId`, `name`, `priceDelta` | belongs to `restaurants` and `menu_items` |
| `menu_item_addons` | `id` | `restaurantId`, `menuItemId`, `name`, `price` | belongs to `restaurants` and `menu_items` |
| `orders` | `id` | `orderNumber`, `status`, `totalAmount`, `restaurantId`, `tableId` | belongs to `restaurants` and `tables`; has many `order_items` |
| `order_items` | `id` | `orderId`, `menuItemId`, `quantity`, `price` | belongs to `orders` and `menu_items` |
| `tables` | `id` | `restaurantId`, `name`, `code`, `capacity`, `qrCode` | belongs to `restaurants`; has many `orders`, `reservations` |
| `reservations` | `id` | `restaurantId`, `tableId`, `customerName`, `guestCount`, `reservationAt`, `status` | belongs to `restaurants`, `tables`, optional `users` |
| `users` | `id` | `restaurantId?`, `name`, `email`, `role`, `isActive` | may belong to a `restaurant`; has many `reservations` |
| `inventory_items` | `id` | `restaurantId`, `name`, `quantity`, `unit`, `lowStockLevel` | belongs to `restaurants`; optional relation to `suppliers` |
| `suppliers` | `id` | `restaurantId`, `name`, `isActive` | belongs to `restaurants`; has many `inventory_items`, `purchase_orders` |
| `purchase_orders` | `id` | `restaurantId`, `supplierId?`, `status`, `totalAmount` | belongs to `restaurants` and optional `suppliers`; has many `purchase_order_items` |
| `purchase_order_items` | `id` | `purchaseOrderId`, `name`, `quantity`, `unitPrice` | belongs to `purchase_orders` |
| `subscriptions` | `id` | `restaurantId`, `planName`, `status`, `billingEmail` | belongs to `restaurants` |
| `audit_logs` | `id` | `restaurantId`, `entity`, `entityId`, `action`, `changes`, `oldValues`, `newValues` | belongs to `restaurants` |

**Enums** defined in the schema include `OrderStatus`, `PurchaseOrderStatus`, `ReservationStatus`, `SubscriptionStatus`, `UserRole`, `Role`.

The schema enforces referential integrity with cascading deletes on many relationships (e.g., deleting a restaurant cascades to its menu items, orders, etc.).
