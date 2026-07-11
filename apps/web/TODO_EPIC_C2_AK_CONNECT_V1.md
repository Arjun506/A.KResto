# TODO_EPIC_C2_AK_CONNECT_V1 (EPIC C2 Smart Search & Discovery)

## Phase 0 — Planning & scaffolding

- [ ] Create route shell: `apps/web/app/ak-connect/page.tsx`
- [ ] Create premium background + glass theme utilities/components

## Phase 1 — UI: Discovery experience (mock data)

- [ ] Create `components/ak-connect/HeroSearch.tsx`
- [ ] Create `components/ak-connect/BusinessCard.tsx`
- [ ] Create `components/ak-connect/QuickPreviewModal.tsx`
- [ ] Create section components:
  - [ ] NearbyBusinessesSection
  - [ ] FeaturedBusinessesSection
  - [ ] TrendingSection
  - [ ] PopularSection
  - [ ] CategoriesSection
  - [ ] OffersStrip
  - [ ] RecentlyViewedSection
  - [ ] RecommendationsSection
  - [ ] MapPreview
- [ ] Create `CustomerShell` (layout + section stack + footer nav)

## Phase 2 — Frontend service layer (customer-connect)

- [ ] Create `apps/web/services/customer-connect.service.ts`
- [ ] Define types in `apps/web/src/types/customer-connect.types.ts`
- [ ] Mock implementations backed by localStorage where applicable

## Phase 3 — Backend module (thin controllers + mocked data)

- [ ] Create `apps/api/src/ak-connect/*` module/controller/service
- [ ] Add routes for search/discovery sections (mock for now)

## Phase 4 — Wire data to UI

- [ ] Connect shell sections to `customer-connect.service.ts`
- [ ] Add loading skeletons

## Phase 5 — Animations & polish

- [ ] Card tilt + hover, scroll reveal, floating shapes
- [ ] Aurora background with mouse glow
- [ ] Responsive layouts: mobile/tablet/desktop

## Phase 6 — Verification

- [ ] Frontend: `npm run lint` in `apps/web`
- [ ] Frontend: `npm run build` in `apps/web`
- [ ] Backend: `npm run lint` in `apps/api` (if available)
- [ ] Backend: `npm run build:api` in `apps/api`
- [ ] Smoke test `/ak-connect`
