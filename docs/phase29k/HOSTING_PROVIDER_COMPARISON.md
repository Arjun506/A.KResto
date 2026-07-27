# Phase 29K — Hosting Provider Comparison

This document evaluates top managed container hosting providers against the runtime requirements of AK Business OS.

---

## 1. Provider Capabilities Matrix

| Provider | WebSockets Support | BullMQ (TCP Redis) | Rollback | Web App Scaling | Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Render** | `Supported` | `Supported` | `Active` | `Managed` | **RECOMMENDED** (Robust health checks, clean Docker deployments, reliable persistent processes) |
| **Railway** | `Supported` | `Supported` | `Active` | `Managed` | `Suitable Alternate` |
| **Fly.io** | `Supported` | `Supported` | `Complex` | `Manual` | `Not Recommended` (Operational complexity exceeds pilot requirements) |

---

## 2. Infrastructure Mappings Recommendations

- **Web Frontend**: Render Web App
- **Core API & Workers**: Render Web Service (Enables persistent HTTP + WebSocket listener)
- **PostgreSQL**: Supabase PostgreSQL (Managed)
- **Redis (BullMQ)**: Upstash Redis (Supports native ioredis TCP TLS connections)
- **Object Storage**: Cloudflare R2 (S3-compatible, zero egress fees)
