# Phase 31 Wave 5 — Communication Provider Architecture

---

## Provider Interfaces & Staging Isolation

- **Interfaces**: `EmailProvider`, `SmsProvider`.
- **Staging Mode**: Active providers operate in `SIMULATED` mode; live SendGrid and Twilio APIs remain disabled until production provisioning.
- **Queueing & Retries**: Asynchronous dispatches process through BullMQ worker queues with exponential backoff.
