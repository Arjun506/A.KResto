# Phase 31 Wave 4 — Stock Movement Model

---

## Immutable Stock Movement Ledger

```typescript
export interface StockMovementRecord {
  movementId: string;
  tenantId: string;
  locationId: string;
  warehouseId?: string;
  itemId: string;
  movementType: 'PURCHASE_RECEIPT' | 'SALE' | 'CONSUMPTION' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT' | 'WASTE';
  quantity: number;
  unitOfMeasure: string;
  referenceId: string; // e.g., Order ID, PO ID, Transfer ID
  actorId: string;
  timestamp: string;
}
```
