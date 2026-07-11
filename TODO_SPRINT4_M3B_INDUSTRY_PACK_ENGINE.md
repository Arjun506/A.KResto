# TODO — Sprint 4 M3B: Industry Pack Engine (Milestone only)

## Step 1 — Create Industry Pack engine backend scaffold

- [ ] Add `apps/api/src/industry-packs/` folder
- [ ] Add pack metadata registry (initially in-memory)
- [ ] Add pack loader/definition types (modules/widgets/routes/permissions/config)

## Step 2 — Implement Industry Pack lifecycle

- [ ] Install pack: persist pack/module state via existing `ModuleStateService` or `tenant_features`
- [ ] Uninstall pack: disable/remove pack-derived modules
- [ ] List installed packs for tenant

## Step 3 — Derived UI outputs

- [ ] Compute sidebar groups from installed packs + module-platform module definitions (no Restaurant logic)
- [ ] Compute widgets from installed packs

## Step 4 — Backend API wiring

- [ ] Create controller endpoints under `industry-packs` (generic)
- [ ] Import `IndustryPackModule` into `apps/api/src/app.module.ts`

## Step 5 — Tests + docs

- [ ] Add unit tests for install/uninstall + derived UI
- [ ] Add docs under `docs/industry-packs/` describing the engine

## Step 6 — Run checks

- [ ] Build API + Web
- [ ] Lint + TypeScript compile
- [ ] Run tests

## Step 7 — Update AI context + commit summary

- [ ] Update `ai-context` files to reflect completion
- [ ] Provide git commit suggestion
