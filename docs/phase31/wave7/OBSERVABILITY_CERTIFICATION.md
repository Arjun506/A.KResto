# Phase 31 Wave 7 — Observability Certification

---

## Structured Logging & Health Diagnostics

- **Health Endpoints**: `/health/live` and `/health/ready` check NestJS context, PostgreSQL connectivity, and Upstash Redis ping.
- **Log Sanitation**: Structured JSON logger redacts passwords, tokens, credit card numbers, and OTP codes before stdout output.
