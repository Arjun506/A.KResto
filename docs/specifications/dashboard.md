# Specification: Dashboard Module

## 1. Overview
The Dashboard Module acts as the central user portal layout controller. It resolves tenant layouts and aggregates reports for widgets.

## 2. Technical Specifications
- **Table Mapping:** `dashboard_widgets` metadata database maps.
- **Core Interfaces:**
  - `getLayout(userId: string): Promise<DashboardLayout>`
  - `saveLayout(userId: string, layout: DashboardLayoutDto): Promise<void>`
  - `getWidgetMetrics(widgetId: string): Promise<WidgetMetricsPayload>`

## 3. Endpoints & API Contract
- `GET /api/v1/dashboard/layout` - Fetches active UI layout configurations for a user.
- `PUT /api/v1/dashboard/layout` - Saves drag-and-drop structural updates.
- `GET /api/v1/dashboard/metrics` - Aggregates statistics for widget charts.
