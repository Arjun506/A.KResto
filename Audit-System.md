# Audit System

Captures and records all system mutations to enforce security compliance.

## Logs Schema
- **actorId**: UUID profile key.
- **action**: Mapped code action (e.g. `UPGRADE`, `LOGIN`, `ACTIVATE`).
- **resource**: Target entity key.
- **ipAddress**: Client IP source.
- **changes**: Detail description list of diffs.
