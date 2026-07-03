# Specification: Permission Engine Module

## 1. Overview
The Permission Engine controls role permissions, access control lists (ACL), and checks dynamic capabilities for tenant request validation.

## 2. Technical Specifications
- **Framework:** `PermissionsGuard` utilizing role-permission metadata.
- **Table Mapping:** `roles`, `permissions`, `role_permissions` join.
- **Core Interfaces:**
  - `checkPermission(userId: string, permission: string): Promise<boolean>`
  - `assignRole(userId: string, roleId: string): Promise<void>`
  - `listRoles(tenantId: string): Promise<Role[]>`

## 3. Endpoints & API Contract
- `GET /api/v1/permissions/roles` - Lists custom roles defined in tenant context.
- `POST /api/v1/permissions/assign` - Assigns a designated role to a workspace member.
- `POST /api/v1/permissions/verify` - Verifies token scopes for administrative checks.
