# Sprint 1 – Milestone 1D: Business Workspace Onboarding UI (Frontend Only)

## Step 0 — Verify current state

- [x] Found existing onboarding wizard at `apps/web/app/onboarding/page.tsx`
- [x] Read it to confirm current steps don’t match Sprint 1D screen list
- [x] Checked `services/business.service.ts` for `registerBusiness` payload shape

## Step 1 — Refactor onboarding page (phased approach)

- [ ] Replace `app/onboarding/page.tsx` with new 9-step guided onboarding UI (Welcome, Business Information, Industry, Module, Preferences, Subscription, AI Setup, Progress, Ready)
- [ ] Keep premium glassmorphism styling and smooth animations
- [x] Implement industry cards list (10 industries)

- [ ] Implement module selection UI (placeholder tiles if module list not available)
- [ ] Implement Workspace Preferences including logo upload + cover upload
- [ ] Implement AI Assistant Setup UI
- [ ] Implement animated provisioning progress phases
- [ ] Finalize by calling existing `registerBusiness(...)` and redirect to `/dashboard`

## Step 2 — Map UI state to backend request

- [ ] Extend `RegisterBusinessRequest` mapping (in-page mapping) to include selected fields supported by backend
- [ ] If logo/cover uploads can’t be sent via current API shape, degrade gracefully (store as local preview + send preset strings)

## Step 3 — Accessibility / validation

- [ ] Step-level validation + inline error messages
- [ ] Keyboard navigable selection cards
- [ ] ARIA labels for grids and interactive tiles

## Step 4 — Build & test

- [ ] Run `npm run lint` and `npm run build` in `apps/web`
- [ ] Manual smoke test through all steps
