# Phase 30 Wave 3 — Customer Data Matrix

---

## Consumer Service Endpoint Contracts

| Feature Surface | Endpoint / Service | Method | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Restaurant / Provider Detail** | `getRestaurantDetail(slug)` | `GET` | Display demo provider fixture |
| **Menu / Offering Catalog** | `getRestaurantMenu(slug)` | `GET` | Render empty menu state |
| **Order Placement** | `createOrder(payload)` | `POST` | Return order validation error |
| **Table Booking** | `bookTable(payload)` | `POST` | Return booking validation error |
| **Order Status Tracking** | `getOrder(orderId)` | `GET` | Render order tracking skeleton |
| **Coupon Validation** | `validateCoupon(code)` | `POST` | Return coupon invalid notice |
