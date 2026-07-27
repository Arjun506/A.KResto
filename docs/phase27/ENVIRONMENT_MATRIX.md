# Phase 27 — Environment Matrix

This document defines the variables configuration and environment isolation rules for the launch baseline.

---

## 1. Environment Configurations

| Environment Name | Target Domain | Database Instance | Security Isolation |
| :--- | :--- | :--- | :--- |
| **LOCAL** | `localhost:3000` | SQLite / Local PG | Dev keys (Git-ignored) |
| **TEST** | CI Pipeline | Temp SQLite | Test mock keys |
| **STAGING** | `staging.akresto.com`| Staging PG Pool | Isolated keys |
| **PRODUCTION** | `business.akresto.com`| Production PG Cluster | KMS Envelope Encryption|

---

## 2. Secrets Management Guidelines

- Secrets must be injected using secure environment configs (e.g. AWS Secrets Manager / Docker Secret mounting).
- Never commit `.env` files to git repositories.
- Client bundles must never contain server secrets. Frontend vars must be strictly limited to prefix `NEXT_PUBLIC_`.
