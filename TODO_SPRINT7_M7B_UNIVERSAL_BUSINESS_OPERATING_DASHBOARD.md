# TODO_SPRINT7_M7B — Universal Business Operating Dashboard (Release 1)

## Plan steps

1. Locate existing dashboard engine/widget contract (Dashboard Engine + widget registry).
2. Replace `apps/web/app/dashboard/page.tsx` role-switch with universal dashboard entry component.
3. Implement `UniversalBusinessDashboard` UI scaffold with all required sections (AI + Universal Search placeholders included).
4. Add widget rendering entrypoint slot that will use module-platform `getDashboardWidgets(role)` output.
5. Create minimal client-side placeholders for KPI/sections and map module-platform widget definitions to placeholder cards.
6. Backend: ensure module registry widgets/permissions support dashboard home widgets (may extend bootstrap modules).
7. Validate build + lint for web and api.
8. Smoke test: login → `/dashboard` renders universal dashboard without errors.
