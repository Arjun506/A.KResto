# Phase 31 Wave 2 — Organization, Business & Location Model

---

## Multi-Tenant Hierarchy Architecture

```
Organization (Group Entity)
   ├── Business 1 (e.g. Restaurant Division)
   │     ├── Location 1 (Main Branch)
   │     └── Location 2 (Airport Outlet)
   └── Business 2 (e.g. Retail Division)
         └── Location 3 (Downtown Store)
```

- **Scope Isolation**: Tenant ID and location ID are verified server-side on every request to prevent cross-tenant data leaks.
