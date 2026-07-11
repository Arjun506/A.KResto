# Specification: Products Module

## 1. Overview
The Products Module handles core catalog items, barcode/SKU properties, product variants, and dynamic category maps.

## 2. Technical Specifications
- **Table Mapping:** `products`, `product_variants`, `product_categories` (new).
- **Core Interfaces:**
  - `createProduct(data: CreateProductDto): Promise<Product>`
  - `updateCatalog(productId: string, data: UpdateProductDto): Promise<Product>`
  - `listCatalog(filters: ProductFiltersDto): Promise<Product[]>`

## 3. Endpoints & API Contract
- `POST /api/v1/catalog/products` - Registers a product in the tenant catalog.
- `GET /api/v1/catalog/products` - Returns product items with barcode, SKU, and category filters.
- `PATCH /api/v1/catalog/products/:id` - Updates pricing, descriptions, and stock association settings.
