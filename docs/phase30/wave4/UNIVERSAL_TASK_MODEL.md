# Phase 30 Wave 4 — Universal Task Model

---

## Universal Task Engine Specifications

```typescript
export interface UniversalTask {
  taskId: string;
  type: 'KITCHEN_ORDER' | 'ROOM_CLEANING' | 'RETAIL_RESTOCK' | 'CLINIC_PREP' | 'DELIVERY' | 'FIELD_REPAIR';
  title: string;
  description: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assignedTo: string;
  location: string;
  dueAt: string;
  checklist?: { id: string; label: string; done: boolean }[];
  notes?: string;
}
```
