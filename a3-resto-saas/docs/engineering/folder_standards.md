# Engineering Standard: Folder Standards

## 1. Directory Structure Rules

Maintain a clean monorepo folder layout. Directories are separated by domain and responsibility:
- **`apps/api/`:** NestJS source code, controllers, DTOs, strategies, modules, guards, and services.
- **`apps/web/`:** NextJS App Router layouts, pages, components, client states, hooks, and context files.
- **`libs/capabilities/`:** Reusable system business modules (e.g. CRM, POS, HRMS).
- **`libs/industry-packs/`:** Specific layout schemas, overrides, and metadata structures for target industries.
- **`packages/`:** Common validation DTOs, helper libraries, and constant files.

## 2. Directory Hygiene

- Keep file sizes small. Split large controller files containing more than 500 lines into separate controllers.
- Group files by module name (e.g. `auth/auth.controller.ts`, `auth/auth.service.ts`) rather than file type categories.
