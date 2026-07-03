# Industry Pack #3: Hotel

## 1. Overview
The Hotel Pack optimizes capabilities for room bookings, guest management, and hospitality checkouts.

## 2. Core Configurations & Overrides
- **Business Type:** `HOTEL`
- **Visual Extensions:** Adds room calendar matrices, guest profiles, and checking boards.
- **Prisma metadata JSONB Mapping:**
  - `roomType`: room categorization details (e.g. Deluxe, Suite).
  - `checkInTime` / `checkOutTime`: Standard daily timeline rules.
  - `amenities`: Array of hospitality items (e.g. WiFi, Pool).

## 3. Workflow Modifications
- Links booking transactions to automated cleaning schedules.
- Aggregates room-service invoices into a single guest bill at checkout.
