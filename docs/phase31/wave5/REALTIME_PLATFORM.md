# Phase 31 Wave 5 — Realtime Platform

---

## Socket.IO & Redis Event Bus

- **Socket Authentication**: Connections verify JWT tokens before joining socket rooms (`tenant:{id}`, `order:{id}`, `kds:{locationId}`).
- **Room Join Protection**: Unauthorized room join attempts are rejected, preventing cross-tenant realtime eavesdropping.
