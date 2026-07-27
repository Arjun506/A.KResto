# Inventory Foundation (`inventory-foundation`)

The **Universal Inventory Foundation** provides industry-agnostic stock tracking, multi-warehouse management, double-entry inventory ledger movements, stock allocation, quality inspection, perishable expiry monitoring, batch/serial tracking, and financial valuation capabilities for AK OS 2035.

Every present and future Industry Pack (Restaurants, Retail, Hotels, Warehouses, Manufacturing, Healthcare, Logistics, Education, Rental Businesses, Service Businesses) inherits these capabilities without hardcoded industry branching.

---

## 🏛️ Bounded Contexts

1. **Registry (`/inventory-items`)**: Master stock item definitions and Multi-UOM conversion factors (Purchase Unit, Storage Unit, Sales Unit, Reporting Unit).
2. **Warehouses (`/warehouses`)**: Multi-warehouse facility management & multi-level hierarchy (Region ➔ Zone ➔ Campus ➔ Building ➔ Floor ➔ Room ➔ Location).
3. **Storage Locations (`/storage-locations`)**: Granular internal location hierarchy (Aisle, Rack, Shelf, Bin, Cold Storage Room).
4. **Status Engine (`/inventory-status`)**: Stock status states (`AVAILABLE`, `RESERVED`, `QUARANTINED`, `DAMAGED`, `RETURNED`, `IN_TRANSIT`, `ON_HOLD`, `BLOCKED`).
5. **Allocation Engine (`/inventory/allocate`)**: Automatic and manual priority stock allocation.
6. **Quality Inspection (`/inventory/inspections`)**: Incoming/Outgoing inspection logging and quality holds.
7. **Forecasting (`/inventory/forecasts`)**: Demand forecasting and safety stock recommendations.
8. **Approval Workflow (`/stock-movements/:id/workflow`)**: Stock movement workflow (`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` ➔ `REJECTED` ➔ `POSTED`).
9. **Ledger Snapshots (`/inventory/snapshots`)**: Periodic immutable ledger snapshots for reconciliation.
10. **Versioning (`/inventory/versions`)**: Configuration versioning and rollback support.
11. **Stock Levels (`/stock-levels`)**: Real-time snapshot balance tracking.
12. **Movements Ledger (`/stock-movements`)**: Immutable double-entry ledger of stock movements (`RECEIPT`, `ISSUE`, `TRANSFER`, `ADJUSTMENT`, `SCRAP`).
13. **Stock Reservations (`/stock-reservations`)**: Soft/Hard stock reservation engine with expiration TTL.
14. **Batch Management (`/inventory-batches`)**: Batch/Lot number tracking & FEFO allocation.
15. **Serial Management (`/inventory-serials`)**: Unique serial tracking per individual item unit.
16. **Expiry Management (`/inventory-expiry`)**: Perishable stock expiry monitoring and alert triggers.
17. **Adjustments (`/inventory-adjustments`)**: Shrinkage, damage, write-off, and found stock adjustments.
18. **Transfers (`/stock-transfers`)**: Inter-warehouse stock transfer requisitions.
19. **Reorder Rules (`/inventory-reorder-rules`)**: Automated reorder point (ROP), safety stock, and reorder trigger alerts.
20. **Valuation (`/inventory-valuation`)**: Financial valuation (`FIFO`, `LIFO`, `AVCO`, `Standard Cost`).
21. **Reference Lookups (`/inventory-lookups`)**: ISO reference lookups for warehouse types, valuation methods, stock statuses, and serial statuses.
