# Phase 31 Wave 3 — Order State Machine

---

## Order Lifecycle Transitions

```
DRAFT ──► PENDING ──► CONFIRMED ──► IN_PROGRESS ──► READY ──► COMPLETED
  │          │            │
  └──────────┴────────────┴───────► CANCELLED
```

- **Transition Rules**: State transitions enforce legal workflows. Illegal state transitions (e.g. `COMPLETED ➔ DRAFT`) throw HTTP 409 Conflict exceptions.
