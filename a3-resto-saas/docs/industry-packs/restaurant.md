# Industry Pack #1: Restaurant

## 1. Overview
The Restaurant Pack overrides core capabilities to tailor the system for dining, quick service, and food delivery operations.

## 2. Core Configurations & Overrides
- **Business Type:** `RESTAURANT`
- **Visual Extensions:** Adds interactive floor layouts, kitchen monitor widgets, and QR code menus.
- **Prisma metadata JSONB Mapping:**
  - `openingHours`: Array of daily operational time bounds.
  - `cuisine`: List of culinary style tags (e.g. Italian, Fast Food).
  - `diningOptions`: Array of service states (e.g. Dine-In, Delivery, Takeaway).

## 3. Workflow Modifications
- Integrates Kitchen announcements with ordering notifications.
- Routes POS orders to kitchen displays automatically.
- Maps guest checkouts to table layouts.
