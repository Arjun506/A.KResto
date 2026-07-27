# Phase 30 Wave 2 — Needs Attention Center Specifications

---

## Actionable Alerts Aggregator

The Needs Attention Center aggregates operational issues requiring executive or manager intervention:

### Alert Severities
1. `CRITICAL`: Immediate action required (e.g. system offline, failed payment settlement, critical low inventory).
2. `WARNING`: Action needed today (e.g. 2 items low stock, pending staff approval, booking conflict).
3. `INFO`: Advisory update (e.g. backup completed, subscription renewal approaching).

### Alert Payload Schema
- `id`: Unique alert identifier
- `severity`: `CRITICAL` | `WARNING` | `INFO`
- `category`: `INVENTORY` | `PAYMENTS` | `APPROVALS` | `SECURITY` | `SYSTEM`
- `title`: Short title
- `description`: Summary detail
- `timestamp`: Event creation time
- `actionRoute`: Target route to resolve issue
