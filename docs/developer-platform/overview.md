# Developer Platform Overview

This document presents the technical requirements for the **AK Business OS** Developer Platform.

## 1. Extension Model

Developers can extend platform features using:
- **API Interfaces:** Public REST/GraphQL endpoints exposed with API token access keys.
- **Webhook Infrastructure:** Subscriptions that trigger notifications to external servers on business events (e.g. `order.created`, `invoice.paid`).
- **Dynamic Widgets:** Modular React cards that render custom interfaces inside business dashboards.

## 2. API Security

- **Developer Tokens:** Generated inside client settings dashboards. Must include scopes (e.g. `read:inventory`, `write:pos`).
- **Rate-Limiting:** Set rate limits (e.g. max 600 requests per minute per developer API key) to protect platform servers.
- **Payload Verification:** All webhook posts are signed with HMAC hashes, allowing developer servers to verify requests originate from our platform.
