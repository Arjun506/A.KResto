# Phase 26 — Integration Matrix

This document maps all integration points and communication interfaces between the Business OS services.

---

## 1. Internal & External Interfaces

| Communication Channel | Protocol | Source | Target | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **API Client Requests** | HTTP / JSON | Frontend Web | Backend API Gateway | Checked (Bearer JWT token) |
| **Real-time Live Sockets**| Socket.IO | Frontend Web | Real-time Gateway | Checked (Rooms separation) |
| **Outbox Event Mesh** | Redis / BullMQ | Core Services | Background Workers | Checked (Idempotency keys) |
| **Database Connector** | Prisma / PG | NestJS Core | PostgreSQL Database | Checked (Tenant pool limits) |
| **Envelope Encryption** | KMS Crypt | Security Module | AWS KMS / Mock | Checked (Envelope rotation) |

---

## 2. Dynamic Package Hooks

- **Installation Pipeline**: Modules upload JSON manifests detailing custom routers, routes, widget permissions, and configuration.
- **Entitlement Checks**: The client intercepts page load hooks, matching active packages parameters against subscription entitlements.
