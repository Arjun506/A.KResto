# Phase 29E — Pilot Control Center

This document outlines the user interface and route layout for the `/super-admin/pilots` console.

---

## 1. UI Layout & Sub-sections

1. **Active Pilots Grid**: Lists `Pilot ID`, `Tenant`, `Industry`, `Pilot Stage`, `Setup Complete (%)`, and `Last Activity`.
2. **Invitation Generator**: Single-use token generator supporting expiration dates and revocations.
3. **Provider Status Panel**: Dashboard showing Postgres, Redis, KMS, Twilio, SendGrid, and Stripe Sandbox statuses.
4. **Backup Health Audit**: Shows backup status, retention, and observed restore duration parameters (`NOT_VERIFIED`).
5. **Real Pilot Metrics**: Aggregates total orders, revenue, and failures (displays `NO_REAL_PILOT_ACTIVITY_YET` on empty states).
