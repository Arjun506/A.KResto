# Inventory Foundation Architecture

```mermaid
graph TD
    Products[Product & Catalog Foundation - Epic 4] -->|productId| InventoryRegistry[Inventory Registry & Multi-UOM]
    Businesses[Business Foundation - Epic 2] -->|businessId| Warehouses[Multi-Warehouse & Hierarchy]
    
    InventoryRegistry --> StockLevels[Real-Time Stock Levels]
    Warehouses --> StorageLocations[Aisle / Rack / Shelf / Bin]
    StorageLocations --> StockLevels
    
    StockMovements[Double-Entry Movements Ledger] -->|Update Balance| StockLevels
    StockReservations[Stock Reservation Engine] -->|Hold Available Stock| StockLevels
    InventoryAllocation[Allocation Engine] -->|Reserve Stock| StockLevels
    QualityInspection[Quality Inspection Foundation] -->|Quarantine Stock| StockStatus[Status Engine]
    
    StockLevels --> Valuation[Valuation Engine - FIFO / LIFO / AVCO / Standard]
    StockLevels --> Snapshots[Immutable Ledger Snapshots]
    StockLevels --> Forecasting[Inventory Demand Forecasting]
```

## Platform Integrations
- **Tenant Isolation**: `@TenantId()` header parameter + `TenantGuard`.
- **RBAC**: `@UseGuards(JwtAuthGuard)`.
- **Audit Platform**: `AuditService.logEvent()`.
- **Event Bus**: 20 Domain Events emitted via `EventBusService.publish()`.
- **Soft Delete**: Non-destructive deletion (`deletedAt`) across core entities.
