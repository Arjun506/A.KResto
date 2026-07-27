# Universal Business Foundation Engine

The **Universal Business Foundation Engine** provides an industry-agnostic business domain supporting all future Industry Packs (Retail, Hotel, Restaurant, Warehouse, Salon, Healthcare, Education, Manufacturing).

## Bounded Contexts

1. **`registry`**: Business registration, state machine (`DRAFT` ➔ `PENDING_VERIFICATION` ➔ `VERIFIED` ➔ `ACTIVE` ➔ `SUSPENDED` ➔ `ARCHIVED` ➔ `CLOSED`), approval, duplicate detection, soft deletion.
2. **`ownership`**: Multi-owner management (`OWNER`, `MANAGER`, `OPERATOR`, `PARTNER`), percentages, and transfer history.
3. **`relationships`**: Inter-business linkages (`PARENT`, `CHILD`, `FRANCHISE`, `SUPPLIER`, `CUSTOMER`, `VENDOR`, `PARTNER`, `DISTRIBUTOR`).
4. **`settings`**: Locale, Currency, Timezone, Language, Fiscal Year, Working Hours, Regional Preferences.
5. **`profile` & `branding`**: Legal name, display name, logo, banner, icon, theme, fonts, favicon, email branding, website, social links.
6. **`contacts`**: Universal contact registry (`PRIMARY`, `BILLING`, `EMERGENCY`, `TECHNICAL`, `OTHER`).
7. **`addresses`**: Location management (`HEAD_OFFICE`, `BRANCH`, `WAREHOUSE`, `BILLING`, `SHIPPING`, `STORE`) with GPS coordinates.
8. **`attachments` & `notes`**: Documents/Certificates/Licenses tracking & Rich-Text private/shared/pinned notes.
9. **`lookups`**: ISO reference data for Categories, Currencies, Timezones, Languages, Countries.

## OpenAPI Swagger Specs

Swagger UI available at: `http://localhost:3001/api/docs` under `@ApiTags('Business Foundation — *')`.
