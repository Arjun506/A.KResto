# Phase 29E — Operator Activation Guide

This guide describes how the platform operator initiates a new controlled pilot.

---

## 1. Setup Sequence

1. **Verify Environment**: Audit all backend variables using [PRODUCTION_ENV_AUDIT.md](file:///d:/A3%20resto/a3-resto-saas/docs/phase29/PRODUCTION_ENV_AUDIT.md).
2. **Provider Checks**: Confirm database, cache, and KMS wraps are active.
3. **Register Pilot Record**: Add `PILOT-R-001` (Restaurant) or `PILOT-RT-001` (Retail).
4. **Generate Invitation**: Request invitation link with token.
5. **Onboard Owner**: Provide the invitation link to the external operator.
6. **Readiness Evaluation**: Run the automated pre-order checklist.
7. **Go Live**: Activate pilot monitoring dashboards.
