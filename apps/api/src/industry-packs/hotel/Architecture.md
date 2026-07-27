# Hotel Industry Pack Architecture

The module utilizes the decoupled extension structure specified in the platform standards.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │                 Hotel Industry Pack                 │
  ├─────────────────────────────────────────────────────┤
  │   Property, Rooms, Bookings, Housekeeping, Keys     │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │     AI Platform     │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Decoupling
Extensions map properties, rooms, and bookings using isolated tables:
- `hotel_properties`, `hotel_room_types`, `hotel_rooms`, `hotel_bookings`, `hotel_housekeeping_tasks`, `hotel_maintenance_records`, `hotel_digital_keys`.
- CRM loyalty coordinates stay preferences records.
- Checkout operations initiate transactions directly inside the Payment Foundation model.
