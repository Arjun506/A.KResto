# Phase 31 Wave 2 — Invitation & Membership Security

---

## Staff & Partner Invitation Security

- **Cryptographic Tokens**: Invitation tokens are generated using `crypto.randomBytes(32)` and hashed before storage.
- **Expiration & Single Use**: Invitations expire in 48 hours and are marked used upon redemption.
- **Owner Safety Rule**: The system rejects requests to remove or demote the last remaining active owner of a tenant.
