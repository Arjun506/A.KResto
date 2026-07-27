# Phase 29K — Deployment Provider Decision Card

This card presents options for deploying the first controlled pilot environment of AK Business OS.

---

## 1. Hosting Architecture Options

### Option A — Managed Container Hosting
- **Description**: Frontend deployed to Vercel/Render, API to Render/Railway.
- **Estimated Complexity**: Low (Direct git integration, automated TLS management, and isolated builds).
- **Accounts Required**: Render/Railway account.
- **Dependencies**: Upstash Redis (managed), Supabase Postgres (managed).
- **Advantages**: Easy setup, automated scale, zero local Nginx/PM2 setup, no public IP needed (DNS maps directly using CNAME).
- **Disadvantages**: Moderate hosting cost overhead for high-traffic instances.

---

### Option B — Single VPS Pilot Architecture
- **Description**: Deploy docker-compose or PM2 directly to a single Linux VPS (Ubuntu).
- **Estimated Complexity**: Medium (Requires configuring Nginx, SSL certificates via Certbot, local firewall, and PM2).
- **Accounts Required**: Cloud VPS provider (e.g. AWS EC2, DigitalOcean, Hetzner).
- **Dependencies**: Public IPv4 address allocation.
- **Advantages**: Complete OS control, lowest initial cost.
- **Disadvantages**: High setup burden, manual TLS renewals configuration, manual backup management.

---

### Option C — Cloud Production Architecture
- **Description**: Deploy using Kubernetes or AWS ECS with managed databases and load balancers.
- **Estimated Complexity**: High.
- **Accounts Required**: AWS, GCP, or Azure.
- **Advantages**: High availability, enterprise-grade scalability.
- **Disadvantages**: High initial cost, excessive maintenance complexity.

---

## 2. Recommendation

**CTO_RECOMMENDATION**: **Option A — Managed Container Hosting**  
*Why: Option A provides the lowest operational overhead for launching the first pilot. Managed hosting handles TLS certificates provisioning automatically and supports WebSockets, which eliminates complex manual server setup.*

---

## 3. Operational Domain Status

- **STAGING_WEB_DOMAIN**: `NOT_SELECTED`
- **STAGING_API_DOMAIN**: `NOT_SELECTED`
- **DOMAIN_STATUS**: `NOT_SELECTED`
