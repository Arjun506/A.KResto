# Phase 30 Wave 3 — Universal Activity Model

---

## Unified Activity Timeline Specifications

The Activity Center aggregates all active and historical consumer transactions into a single timeline:

### Activity Entity Contract
- `id`: Transaction identifier
- `type`: `FOOD_ORDER` | `RETAIL_PURCHASE` | `RIDE` | `HOTEL_STAY` | `SALON_BOOKING` | `SERVICE_JOB`
- `providerName`: Business name
- `status`: `REQUESTED` | `CONFIRMED` | `PREPARING` | `IN_TRANSIT` | `COMPLETED` | `CANCELLED`
- `timestamp`: Creation time
- `amount`: Total transaction cost
- `trackingRoute`: Link to live status view
