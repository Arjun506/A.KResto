# Specification: POS (Point of Sale) Module

## 1. Overview
The POS Module controls checkout terminals, layout lists, pricing engines, checkout procedures, and cashier sessions.

## 2. Technical Specifications
- **Table Mapping:** `pos_registers`, `pos_sessions`, `pos_orders` (new).
- **Core Interfaces:**
  - `openSession(registerId: string, initialBalance: number): Promise<PosSession>`
  - `closeSession(sessionId: string, closingBalance: number): Promise<PosSession>`
  - `processCheckout(cart: CheckoutCartDto): Promise<SalesOrder>`

## 3. Endpoints & API Contract
- `POST /api/v1/pos/sessions/open` - Opens a cashier session.
- `POST /api/v1/pos/sessions/close` - Closes the active session and logs cashier reports.
- `POST /api/v1/pos/checkout` - Validates basket pricing, processes payments, and emits checkout events.
