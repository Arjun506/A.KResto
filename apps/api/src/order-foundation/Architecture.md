# Order & Transaction Foundation Architecture

```mermaid
graph TD
    Customers[Customer Foundation - Epic 3] -->|customerId| Orders[Universal Orders Registry]
    Businesses[Business Foundation - Epic 2] -->|businessId| Orders
    Products[Product Foundation - Epic 4] -->|productId| LineItems[Order Line Items]
    Pricing[Pricing Foundation - Epic 5] -->|Calculate Price| Snapshots[Order Calculation Snapshots]
    Inventory[Inventory Foundation - Epic 6] -->|Stock Reservation| Orders
    
    Orders --> LineItems
    Orders --> Snapshots
    Orders --> Lifecycle[Order Lifecycle State Machine]
    Orders --> Transactions[Universal Transaction Engine]
    Orders --> Routing[Smart Routing Rules Engine]
    Routing --> Fulfillment[Fulfillment Execution & Shipments]
    Fulfillment --> Returns[Returns & Refunds Engine]
    Transactions --> Ledger[Transaction Double-Entry Ledger]
```

## Platform Integrations
- **Tenant Isolation**: `@TenantId()` header parameter + `TenantGuard`.
- **RBAC**: `@UseGuards(JwtAuthGuard)`.
- **Audit Platform**: `AuditService.logEvent()`.
- **Event Bus**: 23 Domain Events emitted via `EventBusService.publish()`.
- **Soft Delete**: Non-destructive deletion (`deletedAt`) across core entities.
