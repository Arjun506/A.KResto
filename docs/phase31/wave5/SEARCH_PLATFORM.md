# Phase 31 Wave 5 — Search Platform

---

## Multi-Domain Search Orchestration

- **Search Domains**: Customers, Orders, Products, Inventory, Tasks, Support Tickets.
- **Tenant Scope Enforcement**: All search queries automatically inject `where: { tenantId }` into PostgreSQL full-text index queries (`apps/api/src/search/search.service.ts`).
