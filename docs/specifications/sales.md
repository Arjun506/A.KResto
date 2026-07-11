# Specification: Sales Module

## 1. Overview
The Sales Module tracks billing details, invoices, sales channels, and payment transactions.

## 2. Technical Specifications
- **Table Mapping:** `sales_orders`, `invoices`, `payments` (new).
- **Core Interfaces:**
  - `registerSale(saleData: RegisterSaleDto): Promise<SalesOrder>`
  - `generateInvoice(orderId: string): Promise<Invoice>`
  - `applyPayment(invoiceId: string, paymentDetails: PaymentDetailsDto): Promise<Payment>`

## 3. Endpoints & API Contract
- `POST /api/v1/sales/orders` - Registers sales orders from POS, online channels, or manual inputs.
- `GET /api/v1/sales/invoices/:id` - Retrieves a printable invoice PDF or schema model.
- `POST /api/v1/sales/payments` - Submits transactional payment records.
