# Phase 29G — Domain Setup Operator Guide

This guide details steps for the operator to map DNS and activate TLS for the staging/pilot domains.

---

## 1. DNS Mapping Sequence

1. Log in to your DNS provider (e.g. Cloudflare, Route 53).
2. Add the following records:
   - **Type**: `CNAME`
   - **Name**: `staging`
   - **Target**: `ak-resto-monorepo-web.onrender.com` (or equivalent server instance CNAME)
   - **Proxy Status**: Proxied (enabled Cloudflare SSL protection)
3. Ensure SSL/TLS encryption mode is set to **Full (strict)**.
4. **Verification**: Execute:
   ```bash
   dig staging.akresto.com
   ```
   Confirm CNAME target resolves to Renders instance nodes.
