# Phase 31 Wave 2 — Universal Identity Model

---

## Single Account Persona Switching Specifications

```typescript
export interface UniversalUserIdentity {
  userId: string;
  email: string;
  phone?: string;
  name: string;
  memberships: {
    tenantId: string;
    businessId: string;
    organizationId: string;
    role: string;
    permissions: string[];
  }[];
  partnerProfile?: {
    partnerId: string;
    partnerType: 'DRIVER' | 'DELIVERY' | 'CONTRACTOR' | 'SERVICE_PROVIDER';
    verificationStatus: string;
  };
  customerProfile?: {
    customerId: string;
    rewardsPoints: number;
  };
}
```
