# Logistics Industry Pack Architecture

The module utilizes the decoupled extension structure specified in the platform standards.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │              Logistics Industry Pack                │
  ├─────────────────────────────────────────────────────┤
  │   Hubs, Fleet, Driver Assignments, Routes, COD, POD │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │     AI Platform     │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Decoupling
Extensions map hubs, vehicles, assignments, routes, and tracking logs using isolated tables:
- `logistics_hubs`, `logistics_vehicles`, `logistics_driver_assignments`, `logistics_shipments`, `logistics_packages`, `logistics_dispatches`, `logistics_routes`, `logistics_route_stops`, `logistics_tracking_events`, `logistics_proof_of_delivery`, `logistics_cod_collections`, `logistics_returns`, `logistics_maintenance_records`.
- Drivers link directly to workforce `employees.id`.
- Surcharges are computed via core pricing books.
- COD cash reconciliation creates CAPTURED ledger transactions inside core payment tables.
