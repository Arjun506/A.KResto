# Business Engine — API Endpoints

Base URL: `/api/v1`

All responses use the standard envelope:

```json
{
  "success": true,
  "message": "optional message",
  "data": {}
}
```

## Public — Workspace Provisioning (Milestone 1B)

### POST `/business/workspace`

Creates a business workspace in a single database transaction.

**Request body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `businessName` | string | yes | min 2 chars, must be unique (case-insensitive) |
| `industry` | string | yes | one of `RESTAURANT`, `RETAIL`, `SALON`, `CORPORATE` |
| `ownerName` | string | yes | min 2 chars |
| `ownerEmail` | string | yes | valid email, must be unique |
| `ownerPassword` | string | yes | min 6 chars |
| `currency` | string | no | defaults to `USD` |
| `timezone` | string | no | defaults to `UTC` |
| `language` | string | no | defaults to `en` |
| `themePreset` | string | no | defaults to `glass-violet` |
| `selectedPlan` | enum | no | `TRIAL`, `STARTER`, `PROFESSIONAL`, `ENTERPRISE` |
| `location` | string | no | |
| `address` | string | no | |

**Transaction steps (all-or-nothing)**

1. Validate duplicate business name and owner email
2. Create workspace (`Tenant`)
3. Seed industry modules (`tenant_features`)
4. Create default branch (`Main Branch` / `MAIN`)
5. Seed role permissions (`roles_permissions`, includes `RESTAURANT_OWNER`)
6. Create owner user
7. Create 14-day trial subscription
8. Persist settings JSON (dashboard layout, AI profile, notifications, marketplace, consumer profile)
9. Write audit log (`WORKSPACE_PROVISIONED`)

**Response `data`**

| Field | Description |
|-------|-------------|
| `access_token` | JWT for the new owner |
| `workspace` | Full tenant record |
| `business` | Business summary (tenant-backed) |
| `owner` | Owner user summary |
| `branch` | Default branch summary |
| `subscription` | Trial subscription summary |
| `modules` | Enabled module keys |
| `roles` | Seeded role names |

### GET `/business/check-name?name={businessName}`

Checks whether a business name and slug are available.

**Response `data`**

```json
{
  "name": "Fresh Cafe",
  "slug": "fresh-cafe",
  "available": true
}
```

When unavailable, `reason` explains whether the name or slug is taken.

### GET `/business/industries`

Returns supported industry packs with labels, descriptions, and default modules.

### GET `/business/currencies`

Returns supported currency options (`code`, `label`, `symbol`).

### GET `/business/timezones`

Returns supported timezone options (`id`, `label`, `offset`).

## Deprecated

### POST `/business/register`

Alias of `POST /business/workspace`. Prefer `/business/workspace` for new integrations.

## Protected — Authenticated Workspace Management

Requires `Authorization: Bearer <token>` and tenant context.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/business/settings` | Full workspace context |
| PATCH | `/business/settings` | Update workspace settings |
| GET | `/business/subscription` | Latest subscription |
| GET | `/business/branches` | List branches |
| POST | `/business/branches` | Create branch |
| PATCH | `/business/branches/:id` | Update branch |
| GET | `/business/features` | List enabled modules |
| PATCH | `/business/features/:key` | Toggle/configure module |

## Error codes

| Status | Scenario |
|--------|----------|
| 400 | Duplicate business name, duplicate email, invalid industry, validation failure |
| 401 | Missing or invalid JWT on protected routes |
| 404 | Workspace/branch/feature not found |
| 500 | Unexpected server error (transaction rolled back) |
