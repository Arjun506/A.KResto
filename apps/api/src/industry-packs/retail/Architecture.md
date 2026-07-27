# Retail Industry Pack Architecture

The module utilizes the decoupled extension structure specified in the platform standards.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │                 Retail Industry Pack                │
  ├─────────────────────────────────────────────────────┤
  │   Stores, Registers, Variants, Promotions, returns  │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │     AI Platform     │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Decoupling
Extensions map stores, variant attributes, and return records using isolated tables:
- `retail_stores`, `retail_registers`, `retail_product_variants`, `retail_stock_batches`, `retail_promotions`, `retail_purchase_orders`, `retail_suppliers`, `retail_returns`.
- CRM loyalty coordinates reward points updates.
- Checkout operations initiate sales transactions directly inside the Payment and Order Foundation models.
