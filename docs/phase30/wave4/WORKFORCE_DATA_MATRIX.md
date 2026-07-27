# Phase 30 Wave 4 — Workforce Data Matrix

---

## Workforce Service Endpoint Contracts

| Feature Surface | Endpoint / Service | Method | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Available Deliveries** | `getAvailableDeliveries(lat, lng, radius)` | `GET` | Render `EmptyState` ("No available jobs") |
| **Accept Delivery** | `acceptDelivery(payload)` | `POST` | Return acceptance validation error |
| **Complete Delivery** | `completeDelivery(orderId, lat, lng)` | `POST` | Return completion error |
| **Partner Earnings** | `getDeliveryPartnerEarnings(partnerId, period)` | `GET` | Render zero earnings summary state |
