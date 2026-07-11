# TODO — Sprint 6: Master Data Platform

## Planned steps

1. Inspect existing NestJS module patterns, auth/tenant/permission wiring.
2. Extend Prisma schema with Master Data tables (multi-tenant).
3. Create Prisma migration SQL for the schema changes.
4. Implement Master Data Nest module (controller/service/dto) with CRUD endpoints.
5. Add permission keys for each resource.
6. Wire Master Data module into `apps/api/src/app.module.ts`.
7. Add minimal capability manifest entry / discovery plumbing (if needed by existing capabilities platform).
8. Add minimal frontend types/services only if required by build.
9. Add basic tests for controller/service compile-time correctness.
10. Run lint + tests + build.

## Progress

- [x] Step 1 (partial): Inspected auth/tenant/permissions patterns and Prisma schema.
- [ ] Step 2: Extend Prisma schema.
- [ ] Step 3: Create migration.
- [ ] Step 4: Implement Master Data module.
- [ ] Step 5: Permission keys.
- [ ] Step 6: Wire module.
- [ ] Step 7: Capability wiring.
- [ ] Step 8: Frontend minimal types/services.
- [ ] Step 9: Tests.
- [ ] Step 10: Lint/tests/build.
