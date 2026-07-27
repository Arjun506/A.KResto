# Phase 27 — Go-Live Checklist

This checklist tracks infrastructure configuration, deployment validation, and legal policy updates.

---

## 1. Release Milestones

### A. Infrastructure Boot
- [x] Provision PostgreSQL database with SSL/TLS configurations.
- [x] Setup Redis caches and workers instances.
- [x] Configure DNS mapping for `api.akresto.com` and `business.akresto.com`.
- [x] Configure SSL certificates and CDN caching layers.

### B. Security & Keys
- [x] Provision AWS KMS customer master keys.
- [x] Setup environment secret variables injection.
- [x] Verify logging redaction filters.

### C. Legal & Privacy UI
- [x] Implement Terms of Service link in registration screens.
- [x] Implement Privacy Policy link.
- [x] Standardize cookie consent banner elements.
