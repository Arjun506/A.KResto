# Phase 29H — Invitation Security Audit

This audit validates the tokenization and lifecycle controls protecting invitation links.

---

## 1. Security Controls

- **Single-Use**: Token maps are invalidated immediately after consumption.
- **Expiration**: Generated tokens expire automatically after 30 days.
- **Revocation**: The operator can revoke active tokens via the Pilot Control Center.
- **Hashed Store**: Tokens are hashed and never logged in stdout as plaintext parameters.
- **Scope Restriction**: Tokens are bound specifically to `PILOT-R-001`.
