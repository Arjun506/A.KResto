# Specification: Identity Module

## 1. Overview
The Identity Module handles core user registrations, tenant account associations, profile configurations, and membership updates.

## 2. Technical Specifications
- **Table Mapping:** `users` (Prisma)
- **Keys:** `id` (cuid), `tenantId` (cuid, optional for global admins).
- **Core Interfaces:**
  - `createUser(data: CreateUserDto): Promise<User>`
  - `updateProfile(userId: string, data: UpdateProfileDto): Promise<User>`
  - `listTenantUsers(tenantId: string): Promise<User[]>`

## 3. Endpoints & API Contract
- `POST /api/v1/identity/users` - Create a user member within the tenant context.
- `GET /api/v1/identity/profile` - Retrieve active user profile data.
- `PATCH /api/v1/identity/profile` - Modify profile attributes.
