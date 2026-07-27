# RC2 FIX 2A - Authentication Persistence Architecture (OTP / Reset / Refresh)

This document tracks the auth persistence remediation implemented for Business OS V2.0.

## Security

- Plain OTPs, reset tokens, and refresh tokens are **never persisted**.
- Only HMAC-SHA256 hashes are stored in PostgreSQL via Prisma.
- Hashing uses a dedicated environment secret.

## Environment secret

- **AUTH_TOKEN_PEPPER**: required

## Notes

- Email verification flow (confirm endpoint) preserves existing behavior. If it does not consume the stored OTP, that stored OTP record remains technical debt but behavior is unchanged for RC2.
