# Phase 31 Wave 4 — Scheduling Engine

---

## Universal Workforce Shift & Resource Roster

- **Shift Model**: Tracks employee shifts (`start`, `end`, `breaks`, `locationId`).
- **Overlap Prevention**: Server validates shift creation to prevent overlapping worker shift assignments.
- **Timezone Normalization**: All shift timestamps are persisted in UTC and converted to location timezone for display.
