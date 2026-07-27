# Zero-Trust Security Platform Architecture

The module utilizes custom security models (`security_key_metadata`, `security_access_events`, `security_mfa_challenges`) to manage encryption metadata.

```
                  ┌──────────────────────┐
                  │  Business Console   │
                  └──────────┬───────────┘
                             │ REST
  ┌──────────────────────────▼──────────────────────────┐
  │                 Security Module                     │
  ├─────────────────────────────────────────────────────┤
  │   Key Management, MFA, Decryption, Access Ledger    │
  └──────────┬───────────────────────────────┬──────────┘
             │                               │
  ┌──────────▼──────────┐         ┌──────────▼──────────┐
  │   Core Foundations  │         │  Platform Engines   │
  └─────────────────────┘         └─────────────────────┘
```

## Relational Architecture
The Security module hardens core data boundaries:
- EMR clinical notes, Patient profiles, and Salaries are stored as AES-256-GCM ciphertexts.
- decryption activities trigger `security.data.decrypted` records.
- sensitive operations intercept requests requesting validation of OTP sessions.
