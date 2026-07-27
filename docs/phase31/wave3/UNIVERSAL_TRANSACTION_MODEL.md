# Phase 31 Wave 3 — Universal Transaction Model

---

## Shared Commercial Transaction Blueprint

```typescript
export interface UniversalTransaction {
  transactionId: string;
  tenantId: string;
  locationId: string;
  customerId?: string;
  orderId: string;
  currency: string;             // ISO 4217 Currency Code (e.g. 'INR', 'USD')
  subtotalAmount: number;      // Exact subtotal in smallest currency unit / integer
  discountAmount: number;      // Validated discount total
  taxAmount: number;           // Computed tax total
  grandTotalAmount: number;    // Server-computed final total
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'STRIPE' | 'WALLET';
  paymentStatus: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
  priceSnapshot: {
    itemId: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}
```
