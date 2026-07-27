# Phase 29I — External Staging Verification

This report maps the verified deployment target details and DNS records required for activation.

---

## 1. Verified Deployment Topology

- **Web Service Provider**: `VPS (PM2 / Nginx)`
- **Web Hostname**: `localhost:3000` (Proxy to `staging.example.com`)
- **API Hostname**: `localhost:3001` (Proxy to `api-staging.example.com`)
- **Result**: `DEPLOYMENT_TARGET_MISMATCH` (Corrected topology details mapped)

---

## 2. Required DNS CNAME Records

| Type | Name / Host | Target | TTL | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `A` | `staging` | `<vps-public-ip>` | Auto | DNS Only | Staging Frontend |
| `A` | `api-staging` | `<vps-public-ip>` | Auto | DNS Only | Staging API Gateway |

---

## 3. Operator DNS Actions

1. Log in to your DNS management dashboard.
2. Create the `A` records pointing to the VPS public IP address.
3. Once completed, run validation commands:
   ```bash
   dig staging.example.com
   curl -I https://api-staging.example.com/health/live
   ```
