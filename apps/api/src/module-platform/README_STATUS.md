Sprint 2 / Milestone 2A — Module Platform

Current status (scaffolding):

- Created backend module-platform folder with registry, dependency resolver, tenant module state via tenant_features, controller, and provisioning integration.
- Created frontend module-platform service + shared types.

Known issues:

- ESLint/TS errors exist in backend module-platform scaffolding (placeholder implementations, missing wiring, and some style/typing problems).
- Controllers currently accept tenantId via query parameter placeholders; should be integrated with TenantGuard/JWT context.
- Frontend sidebar/dashboard integration not yet implemented.

Next fixes:

- Correct backend typing, DTOs, and import paths.
- Wire ModulePlatformModule into AppModule.
- Implement permission gating properly and feature-flag resolution.
- Update Sidebar to use module-platform sidebar endpoint.
- Add dashboard widget loader integration.
- Add tests.
