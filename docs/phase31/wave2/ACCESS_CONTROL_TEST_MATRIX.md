# Phase 31 Wave 2 — Access Control Test Matrix

---

## Adversarial Security Test Suite Summary

- **Cross-Tenant Resource Access**: Attempting to query Tenant B data using Tenant A credentials ➔ Returns HTTP 403 / 404 (`PASS`).
- **Cross-Location Resource Access**: Attempting to access Location 2 data using Location 1 staff token ➔ Returns HTTP 403 (`PASS`).
- **Privilege Escalation**: Waiter token requesting Owner settings endpoint ➔ Returns HTTP 403 (`PASS`).
