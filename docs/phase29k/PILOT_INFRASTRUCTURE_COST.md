# Phase 29K — Pilot Infrastructure Cost Estimates

This document lists the estimated cost category mappings for staging and pilot deployment phases.

---

## 1. Cost Matrix

| Component | Free / Trial | Staging / Pilot | Production Scale |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | `$0 / Free Tier` | `$7 / month` | `$19+ / month` |
| **Core API & Workers** | `$0 / Free Tier` | `$7 / month` | `$19+ / month` |
| **PostgreSQL** | `$0 / Supabase free` | `$25 / month` | `$60+ / month` |
| **Redis Cache** | `$0 / Upstash free` | `$0 - $10 / month` | `$20+ / month` |
| **Object Storage** | `$0 / R2 free` | `$0 / month` | `$5+ / month` |
| **SMS Gateway** | `Not Required` | `CURRENT_PRICE_REQUIRES_PROVIDER_VERIFICATION` | `Volume rates` |
| **Email Gateway** | `Not Required` | `CURRENT_PRICE_REQUIRES_PROVIDER_VERIFICATION` | `Volume rates` |

---

## 2. Infrastructure Category Classification

- **Staging / Pilot Cost category**: **Low Operational Cost** (Estimated total infrastructure cost is less than $50/month for controlled pilot scope).
