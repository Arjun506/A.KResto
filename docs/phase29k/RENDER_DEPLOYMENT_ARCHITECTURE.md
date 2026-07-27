# Phase 29K — Render Deployment Architecture

This document describes the staging architecture configured for Render.

---

## 1. Process Separation Topology

```mermaid
graph TD
    Client["Client Browser"] -->|HTTPS| Web["Web Service (apps/web Next.js)"]
    Client -->|HTTPS / WSS| API["API Web Service (apps/api NestJS HTTP)"]
    
    subgraph Core Staging API Runtime
        API -->|TCP| DB["Supabase PG Database"]
        API -->|TCP / TLS| Cache["Upstash Redis Queue"]
    end
    
    subgraph Background Worker Instance
        Worker["Worker Background Service (apps/api NestJS Worker)"] -->|TCP| DB
        Worker -->|TCP / TLS| Cache
    end
```

- **Web Service**: Serves Next.js frontend pages. Port: `3000`.
- **API Web Service**: Serves REST and Socket.IO NestJS core backend. Port: `3001` (CORS and cookie sessions active, does not load queue processors).
- **Background Worker**: Standalone application context without port bindings. Runs with `RUN_MODE=worker` to listen to Upstash queues.
- **Supabase PostgreSQL**: Shared database instance.
- **Upstash Redis**: Managed queue cluster.
