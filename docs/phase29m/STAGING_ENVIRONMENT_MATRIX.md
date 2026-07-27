# Phase 29N — Staging Environment Matrix

This matrix documents the environment variable contract required by the backend to connect to Redis.

---

## 1. Redis Environment Mappings

| Variable Name | Staging Classification | Details |
| :--- | :--- | :--- |
| `REDIS_HOST` | `REQUIRED` | Staging Upstash Redis host address (Verified) |
| `REDIS_PORT` | `REQUIRED` | Staging Upstash Redis port (Verified) |
| `REDIS_PASSWORD`| `REQUIRED` | Staging Upstash Redis AUTH token (Verified) |
| `REDIS_TLS` | `REQUIRED` | TLS enforcement flag (set `true` for staging) |
