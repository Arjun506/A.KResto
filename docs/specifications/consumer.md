# Specification: Consumer Module

## 1. Overview
The Consumer Module controls QR storefront layouts, consumer checkout flows, mobile reservations, and reward points.

## 2. Technical Specifications
- **Table Mapping:** `online_storefronts`, `qr_menus`, `loyalty_accounts` (new).
- **Core Interfaces:**
  - `loadQrMenu(tableId: string): Promise<QrMenuPayload>`
  - `processConsumerCheckout(cart: CartDto): Promise<SalesOrder>`
  - `addLoyaltyPoints(accountId: string, points: number): Promise<void>`

## 3. Endpoints & API Contract
- `GET /api/v1/consumer/qr-menus/:tableId` - Renders active menu configurations for table layouts.
- `POST /api/v1/consumer/checkout` - Handles checkout cart validations and payments.
- `GET /api/v1/consumer/loyalty/:accountId` - Retrieves a customer's rewards profile.
