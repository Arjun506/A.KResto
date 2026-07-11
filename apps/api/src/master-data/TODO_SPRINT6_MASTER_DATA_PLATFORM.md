# TODO — Sprint 6 (M6): Master Data Platform Foundation

## Step 1: Database foundation

- [ ] Add Prisma `master_*` models for all required resource types:
  - Categories, SubCategories, Brands, Units, Taxes, Currencies, Countries, States, Cities, Languages,
    PriceLists, PaymentMethods, Attributes, Tags, Labels, CustomFields, BusinessTypes, IndustryTypes.
- [ ] Ensure each model is multi-tenant (`tenantId` FK) and supports generic fields: `name`, optional `code`, `isActive`, `metadata` Json.
- [ ] Add indexes / uniqueness per tenant.

## Step 2: API service correctness

- [ ] Fix `MasterDataService.list()` search logic (remove invalid `model.fields?.code` runtime usage).
- [ ] Ensure `list()` supports `q` search across `name` and `code` consistently.

## Step 3: Capability manifest alignment

- [ ] Update `master-data-capabilities.manifest.ts` routes to cover all CRUD endpoints (GET list, GET by id, POST, PATCH, DELETE).
- [ ] Verify permission action keys match controller decorators.

## Step 4: Frontend dashboard/widget (foundation only)

- [ ] If missing, create minimal `/dashboard/master-data` UI that can manage resources generically using the backend.
- [ ] Ensure permission-aware visibility.

## Step 5: Tests

- [ ] Add API tests for list/get/create/update/softDelete with tenant scoping and permissions.

## Step 6: Run checks

- [ ] Run lint + tests.
- [ ] Run prisma generate/migrate (as applicable).
