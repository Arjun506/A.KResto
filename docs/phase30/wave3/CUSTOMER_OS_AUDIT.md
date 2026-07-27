# Phase 30 Wave 3 — Customer OS Audit & Classification

**Audit Status**: `COMPLETED`

---

## Customer Platform Surface Audit

| Surface / Route | Feature Area | Status | Data Source | Classification |
| :--- | :--- | :--- | :--- | :--- |
| `/customer` | Universal Consumer App | `EXTENDED` | Next.js Catch-All | `BACKEND_CONNECTED / STATE_FALLBACK` |
| `/online-ordering` | Restaurant Menu & Cart | `REUSED` | NestJS Public Menu API | `BACKEND_CONNECTED` |
| `/qr-order` | Tabletop QR Dining | `REUSED` | NestJS Table QR API | `BACKEND_CONNECTED` |
| `/book-table` | Table Reservations | `REUSED` | NestJS Reservation API | `BACKEND_CONNECTED` |
| `/checkout` | Commerce Checkout Shell | `EXTENDED` | Public Order API | `PARTIAL` |
| `/order/[id]` | Order Tracking | `REUSED` | NestJS Order Status API | `BACKEND_CONNECTED` |
