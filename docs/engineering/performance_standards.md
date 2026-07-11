# Engineering Standard: Performance Standards

## 1. Database Performance

- **GIN Indexes:** Add PostgreSQL GIN indexes on dynamic JSONB `metadata` fields to speed up industry-specific queries.
- **Index Constraints:** Enforce indexes on columns frequently used in filtering, joins, or sorting (e.g. `tenantId`, `createdAt`, `status`).
- **Prisma Client Tuning:** Avoid N+1 queries. Use `include` statements selectively or build structured select projections.

## 2. API & Caching

- **Caching:** Cache non-volatile datasets (like category mappings, system roles, country tax structures) in Redis.
- **Payload Size Limits:** Compress HTTP responses with gzip. Enforce file upload size limits (e.g. max 5MB for documents) at the gateway layer.
- **Pagination:** All listing endpoints must require pagination query parameters (`page`, `limit`). Set limits to prevent database strain.
