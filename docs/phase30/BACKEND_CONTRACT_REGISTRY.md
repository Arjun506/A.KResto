# Phase 30 — Backend Contract Registry

This registry tracks the backend endpoint and schema requirements discovered during the frontend audit.

---

## Required Backend Contracts Matrix

| Feature Surface | Frontend Route | Required Endpoint / Contract | Existing Endpoint? | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Owner Command Center** | `/dashboard` | `GET /api/v1/analytics/executive-summary` | `PARTIAL` | `CONTRACT_REQUIRED` |
| **Multi-Location Aggregation** | `/dashboard` | `GET /api/v1/business/group-summary` | `NO` | `CONTRACT_REQUIRED` |
| **AI Insights Engine** | `/dashboard/ai-insights` | `GET /api/v1/ai/recommendations` | `YES` | `BACKEND_READY` |
| **Universal Activity Timeline** | `/customer` | `GET /api/v1/customer/activity-timeline` | `PARTIAL` | `CONTRACT_REQUIRED` |
| **Universal Search Hub** | `/customer` | `GET /api/v1/search/universal` | `YES` | `BACKEND_READY` |
| **Housekeeping & Field Work** | `/dashboard/hotel` | `GET /api/v1/workforce/tasks` | `NO` | `CONTRACT_REQUIRED` |
| **Driver / Partner Trips** | `/delivery-partner/dashboard` | `GET /api/v1/logistics/driver-trips` | `YES` | `BACKEND_READY` |
| **AK Connect Offline Sync** | `/ak-connect` | `POST /api/v1/sync/offline-batch` | `NO` | `CONTRACT_REQUIRED` |
