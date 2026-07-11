# Database (Prisma)

## Datasource

- Provider: `postgresql`
- URL: `DATABASE_URL`

File: `apps/api/prisma/schema.prisma`

## Models (partial list from schema.prisma)

- `restaurants`
- `tables`
- `users`
- `orders`
- `order_items`

Menu:

- `categories`
- `menu_items`
- `menu_item_variants`
- `menu_item_addons`

Inventory / procurement:

- `inventory_items`
- `suppliers`
- `purchase_orders`
- `purchase_order_items`

Reservations:

- `reservations`

Billing / subscriptions:

- `subscriptions`

Audit:

- `audit_logs`

## Enums

- `OrderStatus`: PENDING, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED
- `ReservationStatus`
- `UserRole`: SUPER_ADMIN, RESTAURANT_OWNER, MANAGER, CASHIER, WAITER, CHEF, CUSTOMER

## Business Mapping

- Enterprise order contract maps ACCEPTED → PENDING.

## TODO

- Add relations used by each service (orders/menu/reservations/inventory).
