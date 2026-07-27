# Phase 28 — Pilot Support Runbook

This runbook defines ticketing operations and support triage paths during pilot onboarding.

---

## 1. Triage Workflow

```mermaid
graph TD
    A[Ticket Created] --> B{Determine Severity}
    B -->|SEV-1| C[Notify On-Call Engineer]
    B -->|SEV-2| D[Triage within 30m]
    B -->|SEV-3| E[Triage within 2h]
    B -->|SEV-4| F[Add to Backlog]
```

---

## 2. Escalation SLAs

- **SEV-1 Critical**: Core system unusable. Developer intervention target: <15 Minutes.
- **SEV-2 High**: Operational feature degraded. Resolution target: <30 Minutes.
- **SEV-3 Medium**: Minor bug with workarounds. Resolution target: <2 Hours.
- **SEV-4 Low**: Cosmetic layout or suggestions. Resolution target: <24 Hours.
