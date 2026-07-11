# Engineering Handbook

This document establishes the official engineering guidelines for developers working on the **AK Business OS** codebase.

## 1. General Coding Standards

- **TypeScript Rules:** Always use strict typing. Avoid `any` declarations. Declare interfaces for service inputs and return payloads.
- **Async Code:** Use `async/await` syntax instead of raw promises. Wrap async calls in clean `try/catch` layers or let Global Filter handle standard errors.
- **DTO Validation:** Implement `class-validator` rules on input properties in API handlers.

## 2. Monorepo Organization

- **Apps Boundary:** `apps/api` (NestJS backend API) and `apps/web` (NextJS frontend) must communicate exclusively via HTTP/GraphQL endpoints.
- **Capabilities Boundary:** Scaffolding new modules should be written inside isolated dynamic directories rather than hardcoded into existing core structures.
- **Shared Helpers:** Shared types, helpers, and DTO schemas belong in the common packages.

## 3. Git Workflow

- **Branch Naming:** `feat/feature-name`, `fix/bug-name`, `docs/doc-name`.
- **Commit Format:** Semantic commit labels (e.g. `feat(pos): implement tax calculate`).
- **PR Cycle:** All pull requests require green CI checkouts (linting, tests, build success) and at least one approving peer review before merging to main.
