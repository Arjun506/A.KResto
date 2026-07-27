# Phase 30 Wave 5 — Industry Pack Contract Specifications

---

## Typed Industry Pack Manifest

```typescript
export interface IndustryPackManifest {
  id: string;                 // e.g. 'pack-restaurant', 'pack-hotel'
  name: string;               // e.g. 'Restaurant & Dining Pack'
  version: string;            // e.g. '1.0.0'
  category: string;           // e.g. 'Food & Hospitality'
  icon: string;               // Icon identifier
  capabilities: string[];     // e.g. ['POS', 'RESERVATION', 'KDS']
  terminology: Record<string, string>; // e.g. { customer: 'Guest', item: 'Dish' }
  routes: { label: string; path: string; icon: string }[];
  widgets: string[];          // Dashboard widget identifiers
}
```
