# Phase 31 Wave 5 — Context Reference Model

---

## Universal Domain Context Pointer

```typescript
export interface DomainContextPointer {
  contextType: 'ORDER' | 'BOOKING' | 'RIDE' | 'TASK' | 'TICKET' | 'INVOICE' | 'DELIVERY' | 'PURCHASE_ORDER';
  contextId: string;
  tenantId: string;
  locationId?: string;
}
```

- **Server-Side Validation**: Context access is validated server-side against authenticated JWT session claims (`tenantId`) before returning chat messages, files, or notifications.
