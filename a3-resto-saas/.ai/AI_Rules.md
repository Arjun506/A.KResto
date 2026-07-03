# AI Rules & Behavioral Guidelines

This document outlines the core operational directives and constraints for any AI Agent working in the **AK Business OS** monorepo.

## 1. Safety and Stability Mandates

- **Do Not Break Production:** Existing modules, API schemas, and feature toggles must remain functional. Evolving existing code must be done incrementally.
- **Strict Linting & Compiling:** Before submitting any work, ensure the project builds successfully, there are no TypeScript compile errors, and linting passes cleanly.
- **Tenant Isolation Security:** Never write code that accesses tenant database tables without applying the `TenantGuard` or checking tenant-context in database queries. Database queries should always be scoped to `tenantId`.

## 2. Architectural Conventions

- **Capability-Driven Development:** Do not build monolith capabilities. Everything must register with the **Capability Engine** and be togglable by feature keys.
- **Separation of Concerns:** Business logic belongs in services, endpoints in controllers, validation in DTO classes, and persistence in Prisma repositories.
- **No Direct Inter-Capability Queries:** A module must not directly query another module's database tables. It must use explicit module-to-module interfaces or trigger events.

## 3. Communication and Review

- **Commit Message Hygiene:** Use structured semantic commits (e.g. `feat(auth): add role checks`, `fix(inventory): fix low stock alert`).
- **Plan Verification:** For complex features, always request user confirmation on design documents before generating execution code.
- **No TODO Placeholder Comments:** All files must contain production-ready implementations. Avoid leaving `// TODO` or empty placeholder methods.
