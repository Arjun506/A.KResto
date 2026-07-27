# Order & Transaction Foundation (`order-foundation`)

The **Universal Order & Transaction Foundation** provides industry-agnostic transaction orchestration, master order registry, line items, calculation snapshots, fulfillment execution, partial fulfillment, shipments & package tracking, returns & refunds split, SLA management, and multi-criteria smart routing for AK OS 2035.

Every present and future Industry Pack (Restaurants, Retail, Hotels, Healthcare, Logistics, Manufacturing, Warehousing, Education, Rental Businesses, Professional Services, Marketplace) inherits these capabilities without hardcoded industry branching.

---

## 🏛️ Bounded Contexts

1. **Transactions (`/order-transactions`)**: Universal Commercial Transaction Engine (`QUOTE`, `ESTIMATE`, `RESERVATION`, `BOOKING`, `SUBSCRIPTION`, `INVOICE`, `CREDIT_NOTE`, `DEBIT_NOTE`, `SERVICE_TICKET`, `ORDER`).
2. **Registry (`/orders`)**: Master order headers and line item management.
3. **Order Types (`/order-types`)**: Order classification types (`SALES_ORDER`, `PURCHASE_ORDER`, `SERVICE_ORDER`, `RENTAL_ORDER`, `SUBSCRIPTION_ORDER`, `WORK_ORDER`, `RESERVATION_ORDER`).
4. **Lifecycle (`/orders/:id/status`)**: Order state machine (`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `FULFILLED` ➔ `COMPLETED` ➔ `CANCELLED`).
5. **Line Items (`/orders/:id/items`)**: Granular line items, unit prices, discounts, and tax rates.
6. **Calculation Snapshots (`/orders/:id/snapshots`)**: Immutable historical pricing, discount, and tax snapshots.
7. **Fulfillment Execution (`/orders/:id/fulfillment`)**: Execution steps (`PICKING`, `PACKING`, `DISPATCH`, `DELIVERY`, `COLLECTION`, `DIGITAL_DELIVERY`, `SERVICE_COMPLETION`).
8. **Shipments (`/orders/:id/shipments`)**: Reusable shipment entities (`Shipment`, `Package`, `Tracking`, `Carrier`, `DeliveryAttempt`).
9. **Returns & Refunds (`/orders/:id/returns`)**: Return Authorization (RMA), returned goods, refund requests, and replacement orders.
10. **Cancellation (`/orders/:id/cancel`)**: Order cancellation engine with reason codes and automated stock reservation release.
11. **Ledger (`/orders/:id/ledger`)**: Immutable double-entry financial transaction ledger.
12. **Approval Workflow (`/orders/:id/approval`)**: Approval workflows for high-value orders or discount thresholds.
13. **SLA Engine (`/orders/:id/sla`)**: SLA due dates, target completion, priority, and aging tracking.
14. **Smart Routing (`/orders/:id/route`)**: Multi-criteria routing engine (Inventory Availability, Distance, Operating Hours, Workload).
15. **Versioning (`/orders/:id/versions`)**: Version snapshots & diff comparison.
16. **Notes (`/orders/:id/notes`)**: Internal team and customer-facing order notes.
17. **Tags (`/orders/:id/tags`)**: Dynamic operational and priority tagging.
18. **Lookups (`/order-lookups`)**: ISO reference lookups for order types, order statuses, fulfillment types, fulfillment statuses, and transaction types.
