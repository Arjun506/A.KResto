# Universal Customer Foundation Engine

The **Universal Customer Foundation Engine** provides an industry-agnostic customer domain supporting all future Industry Packs (Retail, Hotel, Restaurant, Warehouse, Salon, Healthcare, Education, Manufacturing).

## Bounded Contexts

1. **`registry`**: Customer registration, identity classification (`GUEST`, `REGISTERED`, `LINKED_USER`, `ANONYMOUS`, `BUSINESS`, `ORGANIZATION`), lifecycle state machine (`PROSPECT` ➔ `LEAD` ➔ `REGISTERED` ➔ `VERIFIED` ➔ `ACTIVE` ➔ `INACTIVE` ➔ `SUSPENDED` ➔ `ARCHIVED` ➔ `DELETED`), duplicate detection, merge & merge history, external IDs.
2. **`profile`**: Personal information, display settings, avatar URL.
3. **`consent`**: Versioned consent engine (Marketing, Privacy, Data Sharing, Cookie, Terms Acceptance).
4. **`loyalty`**: Reusable loyalty foundation baseline (Tier, Status, Points balance).
5. **`contacts`**: Multi-contact directory (Emails, Mobile Phone, Work Phone, Alternate).
6. **`addresses`**: Location management (`HOME`, `WORK`, `BILLING`, `SHIPPING`, `LOCATION`) with GPS coordinates & timezones.
7. **`relationships`**: Inter-entity links (`FAMILY`, `ORGANIZATION`, `BUSINESS`, `EMERGENCY_CONTACT`).
8. **`groups`**: Segmentation engine (`VIP`, `CORPORATE`, `WHOLESALE`, `PREMIUM`, `CUSTOM_GROUPS`).
9. **`tags`**: Dynamic customer tagging engine (`HighValue`, `Loyal`, `ChurnRisk`, `B2B`).
10. **`notes`**: Private, shared, and pinned rich-text notes.
11. **`attachments`**: Document tracking (`ID_CARD`, `PROOF_OF_ADDRESS`, `CONTRACT`, `TAX_DOCUMENT`, `AVATAR`).
12. **`timeline`**: Immutable customer engagement & lifecycle timeline.
13. **`preferences`**: Regional & privacy preferences (Language, Currency, Timezone).
14. **`communication`**: Separated Communication Preferences (Opt-ins) & Immutable Communication History.
15. **`verification`**: Customer identity & channel verification engine (Email/SMS OTP).
16. **`lookups`**: Reference data endpoints for Identity Types, Lifecycle Stages, Consent Types, Contact Types, Address Types.

## OpenAPI Swagger Specs

Swagger UI available at: `http://localhost:3001/api/docs` under `@ApiTags('Customer Foundation — *')`.
