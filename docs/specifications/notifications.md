# Specification: Notifications Module

## 1. Overview
The Notifications Module handles system alerts, email notifications, SMS updates, and WebSocket triggers.

## 2. Technical Specifications
- **Table Mapping:** `notifications`, `notification_templates`, `notification_preferences` (new).
- **Core Interfaces:**
  - `sendNotification(payload: SendNotificationDto): Promise<void>`
  - `registerPreference(userId: string, prefs: NotificationPreferenceDto): Promise<void>`
  - `broadcastAlert(message: string, roles: string[]): Promise<void>`

## 3. Endpoints & API Contract
- `POST /api/v1/notifications/send` - Dispatches an email or SMS notification.
- `GET /api/v1/notifications/unread` - Retrieves unread system alerts.
- `PATCH /api/v1/notifications/preferences` - Configures user alert settings.
