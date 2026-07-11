# TODO EPIC C1 — Customer Home Page (AK Connect)

## Step 1: Repo discovery (no implementation yet)

- [ ] Read existing customer/order/consumer UI entrypoints (e.g. `apps/web/customer/*`).
- [ ] Read existing search + business listing frontend services (`apps/web/services/*`).
- [ ] Identify backend endpoints for business listing/search (controllers/services under `apps/api/src/*`).

## Step 2: Finalize data contracts

- [ ] Confirm response shapes for business cards (logo/cover, rating, distance, delivery time, price range, offers, open/closed, category/type).
- [ ] Confirm favorites + recently viewed + coupons/membership eligibility contracts.
- [ ] Decide query parameters for sections: deals, featured, nearby (needs geo), trending, popular, recommended.

## Step 3: Backend reuse mapping

- [ ] Map existing “business core” services to each customer home section.
- [ ] If consumer-safe endpoints don’t exist, create thin controllers that reuse core services (avoid duplicate logic).

## Step 4: Frontend route + shell

- [ ] Create customer home route in `apps/web/app/*`.
- [ ] Implement `CustomerShell` (Header + sections stack + footer nav).

## Step 5: UI components (glass/premium)

- [ ] Implement `HeaderBar` (location, search, notifications).
- [ ] Implement `HeroBanner`.
- [ ] Implement section components:
  - [ ] TodayDealsStrip
  - [ ] CategoriesGrid
  - [ ] BusinessSection (generic list renderer)
  - [ ] CouponStrip
  - [ ] MembershipBanner
  - [ ] FooterNav

## Step 6: Business card & quick view

- [ ] Implement `BusinessCard`.
- [ ] Implement `QuickViewModal` (Framer Motion; keyboard/ARIA).

## Step 7: Search UX

- [ ] Implement `SearchBar` + suggestions popover.
- [ ] Implement search results tabs (Businesses/Products/Food/Hotels/Services).
- [ ] Voice search button placeholder.

## Step 8: Wire data (adapter layer)

- [ ] Create `customer-connect.service.ts` (frontend API adapter; no UI duplication).
- [ ] Wire sections to service calls with loading skeletons.

## Step 9: Animations + responsiveness

- [ ] Apply motion/animations consistent with current UI patterns.
- [ ] Ensure responsive behavior for all sections (mobile first, then lg grids).

## Step 10: Verification

- [ ] Run frontend typecheck/lint.
- [ ] Run backend tests/lint.
- [ ] Smoke test customer home page + search flow.
