# Universal Pricing Foundation Engine

The **Universal Pricing Foundation Engine** provides an industry-agnostic pricing platform supporting all present and future Industry Packs (Restaurants, Hotels, Retail, Healthcare, Warehousing, Logistics, Manufacturing, Education, SaaS, Digital Commerce).

## Bounded Contexts

1. **`price-books`**: Master price book containers.
2. **`price-lists`**: Specific price lists linked to price books, currencies, and effective dates.
3. **`pricing-strategies`**: Strategy models (`FIXED_PRICE`, `COST_PLUS`, `DYNAMIC`, `SUBSCRIPTION`, `USAGE_BASED`, `COMPETITIVE`).
4. **`approval-workflow`**: Approval workflow state machine (`DRAFT` ➔ `SUBMITTED` ➔ `APPROVED` ➔ `REJECTED` ➔ `PUBLISHED`).
5. **`simulation-engine`**: Simulation & dry-run engine for previewing rule impacts and conflict detection.
6. **`conflict-resolution`**: Precedence hierarchy engine (Customer ➔ Business ➔ Promo ➔ Regional ➔ Channel ➔ Tier ➔ Base).
7. **`coupons`**: Reusable coupon, promo code, voucher, and gift card structures.
8. **`formula-engine`**: Dynamic mathematical formula evaluation parser.
9. **`versioning`**: Price book versioning engine (Draft, Published, Scheduled versions, Rollback capability).
10. **`audit-snapshots`**: Immutable before/after pricing state audit records.
11. **`effective-calendars`**: Business calendars, holiday schedules, blackout periods.
12. **`price-rules`**: Conditional pricing rule engine.
13. **`price-types`**: Classification of price types.
14. **`currencies`**: ISO-4217 multi-currency definitions.
15. **`exchange-rates`**: Real-time and historical currency exchange conversion rates.
16. **`customer-pricing`**: Customer VIP price overrides linked to Customer Foundation.
17. **`business-pricing`**: B2B contract pricing overrides linked to Business Foundation.
18. **`channel-pricing`**: Multi-channel pricing rules (POS, Web Store, Mobile App, Kiosk).
19. **`regional-pricing`**: Geographic market rate overrides.
20. **`tier-pricing`**: Min-quantity tiered pricing matrices.
21. **`promotional-pricing`**: Promotional campaigns and flash sales.
22. **`calculation-engine`**: Core price calculation pipeline (`calculatePrice`).

## OpenAPI Swagger Specs

Swagger UI available at: `http://localhost:3001/api/docs` under `@ApiTags('Pricing Foundation — *')`.
