# Specification: Business Engine Module

## 1. Overview
The Business Engine manages multi-tenant parameters, legal entities, billing currencies, workspace setup, and metadata profiles.

## 2. Technical Specifications
- **Table Mapping:** `restaurants` (Tenant), `branches`, `tenant_features`, `roles_permissions`, `subscriptions`, `audit_logs`, `users`.
- **Workspace model:** `Tenant` serves as both workspace and business entity until a dedicated `business_entities` table is introduced in a later milestone.
- **Core Interfaces:**
  - `createWorkspace(data: CreateWorkspaceDto): Promise<WorkspaceProvisionResponse>`
  - `checkBusinessName(name: string): Promise<BusinessNameAvailabilityResponse>`
  - `updateSettings(tenantId: string, settings: UpdateSettingsDto): Promise<Tenant>`

## 3. Endpoints & API Contract

Base prefix: `/api/v1`

### Milestone 1B — Workspace Provisioning (public)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/business/workspace` | Provisions workspace, owner, branch, modules, roles, subscription, settings, audit log (single transaction) |
| GET | `/business/check-name` | Validates business name/slug availability |
| GET | `/business/industries` | Lists supported industry packs |
| GET | `/business/currencies` | Lists supported currencies |
| GET | `/business/timezones` | Lists supported timezones |

### Workspace management (authenticated)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/business/settings` | Fetches global tenant settings |
| PATCH | `/business/settings` | Modifies tenant settings and metadata |
| GET | `/business/subscription` | Returns latest subscription |
| GET/POST/PATCH | `/business/branches` | Branch CRUD |
| GET/PATCH | `/business/features/:key` | Module registry |

### Deprecated

| Method | Path | Notes |
|--------|------|-------|
| POST | `/business/register` | Alias of `/business/workspace` |

## 4. Provisioning checklist

Each `POST /business/workspace` call executes atomically:

1. Validate input (DTO + duplicate name/email)
2. Create workspace (`Tenant`)
3. Create business summary (tenant-backed)
4. Create owner user
5. Create default branch
6. Assign industry pack modules
7. Assign roles and permissions
8. Create subscription (14-day trial)
9. Create dashboard layout (settings JSON)
10. Create AI configuration (settings JSON)
11. Create notification settings (settings JSON)
12. Create marketplace profile (settings JSON)
13. Create consumer profile (settings JSON)
14. Write audit log

Failure at any step rolls back the entire transaction.
