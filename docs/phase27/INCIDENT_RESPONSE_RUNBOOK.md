# Phase 27 — Incident Response Runbook

This document defines response playbooks and severity levels for infrastructure incidents.

---

## 1. Severity Levels

| Severity | Description | Response SLA | Target Action |
| :--- | :--- | :--- | :--- |
| **SEV-1** | Core API gateway offline / Database corruption | <15 Minutes | Database restore / DNS failover |
| **SEV-2** | Subsystem degraded (POS payments timeout, KDS offline) | <30 Minutes | Worker restart / Redis flush |
| **SEV-3** | Minor operational error (AI insights slow response) | <2 Hours | Logs analysis / Queue adjustments |
| **SEV-4** | Cosmetic layout issue or minor translation bug | <24 Hours | Staging build / NextJS deploy |

---

## 2. Recovery Procedures

### A. Database Restore Playbook
1. Locate latest encrypted PostgreSQL backup file.
2. Verify AWS KMS decryption keys are active.
3. Boot isolated database container and restore backup.
4. Execute smoke tests on target sandbox schema.
