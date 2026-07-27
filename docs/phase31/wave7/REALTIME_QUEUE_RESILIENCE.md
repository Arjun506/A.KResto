# Phase 31 Wave 7 — Realtime Queue Resilience

---

## BullMQ & Socket.IO Failover Verification

- **API/Worker Isolation**: `RUN_MODE=api` executes HTTP web server on port 3001; `RUN_MODE=worker` executes BullMQ queue processors without an HTTP server (`PASS`).
- **Queue Fault Tolerance**: Redis connection drops cause BullMQ processors to pause and retry with exponential backoff without crashing the process (`PASS`).
