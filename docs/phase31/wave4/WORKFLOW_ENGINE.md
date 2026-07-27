# Phase 31 Wave 4 — Workflow Engine

---

## Universal Business Process Automation

- **Event-Driven Triggers**: Listens to domain events (e.g. `order.completed` ➔ trigger kitchen fulfillment; `checkout.completed` ➔ trigger housekeeping task).
- **State Machine Enforcement**: State machine service (`src/workflow-foundation/state-machine/`) validates legal operational state transitions.
