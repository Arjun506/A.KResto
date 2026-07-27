# Phase 31 Wave 5 — Chat Engine

---

## Universal Contextual Messaging Architecture

- **Context Binding**: Conversations link to a `DomainContextPointer` (e.g. Order, Delivery, Support Ticket).
- **IDOR Protection**: Requests to fetch or send messages verify participant membership in the target conversation context.
- **Client Message Deduplication**: Network retries accept a client-generated `clientMessageId` key to prevent duplicate messages.
