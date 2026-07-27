# Zero-Trust Data Security Platform Reference Implementation

This module provides zero-trust data security, envelope encryption, versioned key rotation, step-up MFA verification, and access audit ledger logging. It integrates directly into the Business OS Core Platform (Epics 1-22) and serves as the core cryptographic manager.

## Bounded Contexts
1. **Key Management (KMS)**: Tenant-aware DEKs wrapping/unwrapping using Master Key (MEK) configurations.
2. **Data Encryption**: Authenticated AES-256-GCM field encryption and decryption logic.
3. **MFA Challenge & Verification**: Issuing OTP codes and verifying step-up headers.
4. **Access Ledger**: Recording all decryption occurrences for audit logging.
5. **Blind Hashed Indexing**: Normalized HMAC-SHA-256 generation for exact-match lookups.
