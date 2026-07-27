# Phase 29K — Managed Hosting Selection & Decisions

**Release Status**: `MANAGED_ARCHITECTURE_READY_FOR_OPERATOR_APPROVAL`

---

## 1. Staging Deployment Blueprint Mappings

- **Recommended Hosting Provider**: Render
- **Recommended Web Hosting**: Render Web Service
- **Recommended API Hosting**: Render Web Service
- **Recommended Worker Hosting**: Render Web Service (BullMQ workers execute inside NestJS process)
- **Recommended PostgreSQL**: Supabase PostgreSQL (Managed)
- **Recommended Redis**: Upstash Redis (Managed TLS TCP)
- **Recommended Storage**: Cloudflare R2
- **Recommended KMS**: Environment MEK Provider (Staging environment key)
- **Recommended Email**: Sandbox Simulated Mode
- **Recommended SMS**: Sandbox Simulated Mode
- **Estimated Pilot Infrastructure Category**: Low Operational Cost
- **VPS Required**: `NO`
- **Public IPv4 Required**: `NO`
- **Custom Domain Required Before Initial Deployment**: `NO` (Deployments will use provider-generated staging URLs first)
