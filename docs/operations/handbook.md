# Operations Handbook

This document presents the operational standards, logs policies, and health monitoring guidelines.

## 1. Structured Logging

- **Library:** Rely on Winston or Pino for structured JSON logs.
- **Log Levels:**
  - `ERROR`: System crashes, database disconnects, authentication failures.
  - `WARN`: Missing optional properties, deprecated API hits, rate limiter blocks.
  - `INFO`: Module initialization, tenant onboarding completions, major state transitions.
  - `DEBUG`: Request tracing payloads in staging environments.
- **No PII in Logs:** Ensure email addresses, passwords, credit card numbers, and tokens are scrubbed from log objects.

## 2. Health Monitoring & Metrics

- **Healthcheck Endpoint:** `/health` returns DB connectivity status, redis cache responsiveness, and memory usage.
- **APM Integration:** Integrate Prometheus metrics in NestJS to count request latency, throughput, and error ratios.
- **Error Tracking:** Capture production exception crashes using Sentry, assigning release tags to every deploy build.
