# Phase 31 Wave 5 — Offline Sync Engine

---

## Universal Sync API & Conflict Resolution

- **Sync Endpoint**: `/api/v1/sync` processes queued mutations.
- **Idempotency**: Repeated sync submissions with identical `clientActionId` return stored action results.
- **Conflict Handling**: Optimistic lock version checks return HTTP 409 Conflict with server and client snapshots when a collision occurs.
