# Engineering Standard: Testing Standards

## 1. Testing Frameworks

- **Unit Tests:** Rely on **Jest** to verify individual files, helpers, and services. Mock database calls using Prisma Mock integrations.
- **E2E / Integration Tests:** Use **Supertest** to verify API endpoint responses and auth guard validations. Use **Playwright** or **Cypress** to test frontend flows.

## 2. Test Requirements & Coverage

- All business-critical logic (pricing algorithms, authentication verification, tenant guards, database constraints) must include unit tests.
- Maintain a minimum **75% code coverage** baseline across the codebase.
- Ensure tests execute in isolated environments. Do not write test scripts that modify production databases. Use transaction rollbacks or temp databases.
