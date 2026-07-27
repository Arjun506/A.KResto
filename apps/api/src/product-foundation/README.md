# Universal Product & Catalog Foundation Engine

The **Universal Product & Catalog Foundation Engine** provides an industry-agnostic product domain supporting all future Industry Packs (Restaurant Menu Items, Retail Products, Hotel Services, Medical Services, Warehouse Stock, Digital Products, Subscriptions, Memberships, Rental Assets, Professional Services).

## Bounded Contexts

1. **`registry`**: Product master record, SKU generation, barcode/UPC/EAN mapping, status lifecycle, soft deletion, Inventory Readiness toggles (`trackInventory`, `isBatchManaged`, `isSerialized`, `isExpiryManaged`, `isStockManaged`).
2. **`versioning`**: Product versioning model (Draft Versions, Published Versions, Scheduled Versions, Rollback capability).
3. **`publishing`**: Publishing Workflow engine (`DRAFT` ➔ `REVIEW` ➔ `APPROVED` ➔ `PUBLISHED` ➔ `ARCHIVED`).
4. **`relationships`**: Inter-product relationships (`RELATED`, `SIMILAR`, `CROSS_SELL`, `UP_SELL`, `ACCESSORY`, `REPLACEMENT`).
5. **`localization`**: Multi-language translation engine for names, descriptions, and dynamic attributes.
6. **`seo`**: SEO Metadata platform (`seoTitle`, `metaDescription`, `metaKeywords`, `urlSlug`, `canonicalUrl`).
7. **`digital`**: Digital product assets, license key structures, expiration rules, download limits.
8. **`compliance`**: Product regulatory compliance, certifications, safety data sheets (SDS), country restrictions.
9. **`categories`**: Multi-level taxonomy tree engine.
10. **`attributes`**: Dynamic typed attribute system.
11. **`variants`**: Product SKU variants generation engine (Matrix combination).
12. **`options`**: Option sets and modifiers (Add-ons, Exclusions).
13. **`bundles`**: Composite products, kits, and bill-of-materials (BOM) assemblies.
14. **`media`**: Product media gallery (Images, Videos, 3D Models, Spec Sheets).
15. **`pricing`**: Multi-currency pricing engine supporting future Customer/Business/Channel overrides.
16. **`uom`**: Units of measure engine (Unit, Kg, Meter, Hour, Pack, Box, Pallet).
17. **`suppliers`**: Multi-supplier mapping and vendor part numbers.
18. **`tags`**: Dynamic catalog tagging engine (`Featured`, `BestSeller`, `Clearance`).
19. **`lookups`**: ISO reference data for Product Identity Types, Lifecycle Stages, Publishing Statuses, Relationship Types, Price Types.

## OpenAPI Swagger Specs

Swagger UI available at: `http://localhost:3001/api/docs` under `@ApiTags('Product Foundation — *')`.
