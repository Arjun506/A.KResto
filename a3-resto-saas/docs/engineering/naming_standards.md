# Engineering Standard: Naming Standards

## 1. Case Conventions

- **Folders:** kebab-case (e.g. `business-engine`, `industry-packs`).
- **Files:** kebab-case with descriptive extension tags (e.g. `auth.controller.ts`, `auth-context.tsx`).
- **Classes / Types / Interfaces:** PascalCase (e.g. `CreateUserDto`, `AuthService`).
- **Variables / Functions:** camelCase (e.g. `listRestaurants`, `userId`).
- **Database Tables / Columns:** snake_case (e.g. `tenant_features`, `tenant_id`).
- **Enums:** UPPERCASE with snake_case (e.g. `RESTAURANT`, `SUPER_ADMIN`).

## 2. Prefixes & Suffixes

- **Interfaces:** Prefix with `I` (e.g. `ITenantService`) to distinguish from classes.
- **DTOs:** Suffix with `Dto` (e.g. `CreateUserDto`).
- **Guards:** Suffix with `Guard` (e.g. `TenantGuard`).
- **Types / Hooks:** Prefix custom React hooks with `use` (e.g. `useRoleBasedRedirect`).
