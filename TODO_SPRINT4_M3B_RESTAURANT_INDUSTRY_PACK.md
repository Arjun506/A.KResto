# TODO — Sprint 4 (Restaurant Industry Pack)

## Step 0 — Baseline validation

- [ ] Build/verify current repo baseline compiles (API + Web)

## Step 1 — Module-platform installed-module persistence

- [ ] Inspect ModuleStateService + Prisma schema usage for tenant_features
- [ ] Implement module install/uninstall state backed by `tenant_features` (no new tables unless required)

## Step 2 — Permission engine wiring for dynamic sidebar/widgets

- [ ] Update ModulePermissionService.can() to consult tenant roles permissions
- [ ] Implement syncModulePermissionsForTenant() to compute required permissions from installed modules

## Step 3 — Create Restaurant Pack scaffolding (new files)

- [ ] Add Restaurant Pack Manifest (pack metadata)
- [ ] Add Restaurant Module Registry with modules:
  - [ ] Menu Management
  - [ ] Order Management
  - [ ] Kitchen Display
  - [ ] POS
  - [ ] Reservations
  - [ ] QR Ordering
  - [ ] Billing
  - [ ] Inventory Integration
  - [ ] CRM Integration
  - [ ] Analytics
  - [ ] Staff Scheduling
- [ ] Add Restaurant Navigation definitions (sidebar items come from module registry)
- [ ] Add Restaurant Widgets definitions (dashboard widgets come from module registry)
- [ ] Add Restaurant Permissions definitions (requiredPermission keys)

## Step 4 — Restaurant dashboard preset + default settings

- [ ] Implement Restaurant Dashboard Preset registration into tenant.settings JSON
- [ ] Add Restaurant Default Roles (extend INDUSTRY_ROLE_MAP for RESTAURANT)
- [ ] Add Restaurant Default Settings (feature flags / opening hours / cuisine / dining options if schema supports)

## Step 5 — Workspace provisioning integration

- [ ] Update WorkspaceProvisioningService/ModuleProvisioner to install Restaurant modules when industry=RESTAURANT
- [ ] Ensure dashboard/sidebar generation works inside Business Workspace context

## Step 6 — Reuse existing Restaurant SaaS without rewriting core logic

- [ ] Identify existing `apps/web/app/restaurant/*` routes/pages
- [ ] Create module definitions mapping existing pages/routes
- [ ] Ensure route access is permission-gated via ModulePlatform

## Step 7 — Testing

- [ ] Install Restaurant Pack → verify sidebar generation
- [ ] Install Restaurant Pack → verify dashboard widget generation
- [ ] Role Validation: verify restricted role cannot see restricted sidebar items/widgets
- [ ] Uninstall Restaurant Pack → verify sidebar/widgets disappear

## Step 8 — Documentation updates

- [ ] Update Industry Packs doc
- [ ] Update Restaurant Pack doc
- [ ] Update Module Registry doc
- [ ] Update Business Core doc

## Step 9 — Output report

- [ ] Compile list of files modified/created + testing/build status
