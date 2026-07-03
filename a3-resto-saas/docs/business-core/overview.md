# Business Core Overview

This document presents the technical requirements for core runtime services.

## 1. Registry & Onboarding

- **Tenant Setup Wizard:** Multi-step onboarding workspace designed to register corporate parameters (legal name, currency, timezone, tax ids) and load configurations.
- **License Manager:** Registers active subscriptions, parses active capability keys, and flags feature logs to database records.

## 2. Capabilities Framework

The core engine handles common base operations while modules override details:
- **Base CRUD Service:** Generic service classes handling basic operations, passing `tenantId` to DB calls.
- **Custom Attributes (JSONB):** Flexible metadata columns allowing modules to extend database properties dynamically.
- **Event Bus:** Core dispatch registry that handles intra-system actions (e.g. notifying the Kitchen module when POS checkout occurs).
