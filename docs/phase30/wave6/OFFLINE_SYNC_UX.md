# Phase 30 Wave 6 — Offline Sync UX Specifications

---

## Offline Action Queue & Sync Conflict Blueprint

- **Offline Action Queue**: Actions executed offline are saved in IndexedDB with `PENDING_SYNC` status.
- **Sync Conflict Resolution Modal**: Renders when local changes conflict with cloud state, giving options: `Keep Local`, `Overwrite with Server`, or `Cancel`.
