# Phase 30 Wave 3 — Customer Chat Architecture

---

## Contextual Messaging Specifications

- **Transaction Attachment**: All chat sessions automatically attach the relevant `orderId`, `bookingId`, or `serviceId` in the conversation header.
- **Participant Types**: Customer ↔ Business, Customer ↔ Driver, Customer ↔ Technician, Customer ↔ Support.
- **Message States**: Sent, Delivered, Read, Typing Indicator, Attachment Preview.
