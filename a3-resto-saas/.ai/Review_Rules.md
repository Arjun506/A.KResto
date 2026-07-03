# Review Rules & Validation Checklists

This document governs code review criteria, PR checklists, and validation parameters.

## 1. Pull Request Checklist

Before submitting a pull request for review, verify:
- [ ] No TypeScript compile errors or warning flags.
- [ ] Code passes formatting checks (`prettier`) and lint filters (`eslint`).
- [ ] Direct database relationships across module boundaries are absent.
- [ ] Role-based access or permission filters are explicitly declared on new controllers.
- [ ] Unit or integration tests are created or updated where applicable.
- [ ] No raw credentials, access keys, or developer settings are hardcoded.

## 2. Validation Guidelines

- **Schema Validations:** Ensure DTO properties are strictly typed, marked with `class-validator` rules, and fully documented in OpenAPI schemas.
- **Prisma Schema Checks:** Verify migrations do not drop active databases without an explicit data mapping step.
- **Tenant Context Checks:** Ensure all CRUD services pass a validated `tenantId` parameter down to DB queries.
