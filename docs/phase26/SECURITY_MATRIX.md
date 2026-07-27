# Phase 26 — Security & Cryptographic Matrix

This document maps all sensitive fields, their classified protection status, decryption requirements, and audit trail metrics.

---

## 1. Sensitive Data Classification Inventory

| Model Field | Classification | Protection | Search Method | Decrypt Authorization | Audit Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Customer.email` | `PII` | AES-256-GCM | Blind Index | Normal Request Context | Checked |
| `Customer.phone` | `PII` | AES-256-GCM | Blind Index | Normal Request Context | Checked |
| `Employee.salary` | `FINANCIAL` | AES-255-GCM | None | Owner Authorization | Checked |
| `Patient.ssn` | `HIGHLY_SENSITIVE`| AES-256-GCM | None | Step-Up MFA Challenge | Audit Generated|
| `Patient.emrNotes`| `HIGHLY_SENSITIVE`| AES-256-GCM | None | Step-Up MFA Challenge | Audit Generated|

---

## 2. Security Controls Enforcement

- **Step-Up Verification**: Initiating sensitive EMR or transaction reviews requires a verified MFA token valid for up to 5 minutes.
- **Audit Trails**: Security audits are stored in the `security_access_events` table ledgers.
- **Redaction**: Structured JSON log pipelines filter out all headers containing tokens or passwords.
