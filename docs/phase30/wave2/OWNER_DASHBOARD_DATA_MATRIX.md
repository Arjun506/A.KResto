# Phase 30 Wave 2 — Owner Dashboard Data Matrix

---

## Executive Data Source & Endpoint Mapping

| Metric / Widget | Backend Endpoint | Method | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **KPI Metrics** | `/api/v1/analytics/kpis` | `GET` | Display `EmptyState` / Loading Skeleton |
| **Revenue Trends** | `/api/v1/analytics/revenue` | `GET` | Render empty line chart container |
| **Needs Attention Alerts** | `/api/v1/inventory/alerts` | `GET` | Render `EmptyState` ("No urgent alerts") |
| **Recent Orders** | `/api/v1/orders` | `GET` | Render empty orders table |
| **Active Team Roster** | `/api/v1/users` | `GET` | Render staff roster loading state |
| **Health Score** | `/api/v1/saas/launch-status` | `GET` | Display "Health analysis pending" |
