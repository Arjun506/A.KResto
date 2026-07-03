# Specification: Business Engine Module

## 1. Overview
The Business Engine manages multi-tenant parameters, legal entities, billing currencies, workspace setup, and metadata profiles.

## 2. Technical Specifications
- **Table Mapping:** `tenants`, `business_entities` (new).
- **Core Interfaces:**
  - `createTenant(data: CreateTenantDto): Promise<Tenant>`
  - `updateSettings(tenantId: string, settings: UpdateSettingsDto): Promise<Tenant>`
  - `resolveTenant(domainOrHeader: string): Promise<Tenant>`

## 3. Endpoints & API Contract
- `POST /api/v1/business/register` - Registers a new tenant and runs the core DB seeds.
- `GET /api/v1/business/settings` - Fetches global tenant settings (currency, locale, timezone).
- `PATCH /api/v1/business/settings` - Modifies tenant settings and metadata parameters.
