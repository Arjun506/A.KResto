# EPIC CORE-WF-1 — Universal Workflow & Automation Engine (AK Business OS v1.0)

## PRODUCTION SPRINT 7

### Mission

Build the Universal Workflow & Automation Engine (Business OS automation for all industry packs).

### Completion Matrix legend

- ✅ Complete
- 🟡 Partial
- ❌ Missing

---

## Step 1 — Audit existing architecture (required)

### Audit targets

- Events
- Socket.IO
- Notification Engine
- Order Engine
- Inventory Engine
- Finance Engine
- CRM Engine
- Permission Engine
- Audit Logs

### Current audit findings (from initial pass)

- Events: 🟡 Partial (socket events exist for orders; no universal event bus confirmed yet)
- Socket.IO: ✅ Complete (order websocket gateway exists)
- Notification Engine: 🟡 Partial (not fully verified)
- Order Engine: 🟡 Partial (order lifecycle exists; workflow triggering not confirmed)
- Inventory Engine: 🟡 Partial (inventory models exist; workflow integration not confirmed)
- Finance Engine: 🟡 Partial (payments module exists; finance workflow integration not confirmed)
- CRM Engine: ❌ Missing (not confirmed)
- Permission Engine: 🟡 Partial (module exists; workflow action auth not confirmed)
- Audit Logs: 🟡 Partial (audit_logs table exists; workflow auto-audit not confirmed)

### Remaining verification tasks

- Confirm Notification/Finance/CRM/Permission usage patterns in code.
- Confirm whether any workflow-like execution history/execution models already exist.
- Confirm whether any existing domain events are emitted in a standardized way.

---

## Step 2 — Completion Matrix (final)

Will be finalized after the second audit pass (deep code & Prisma model verification).

---

## Step 3 — Generate implementation plan (required)

Output must include:

- Existing reusable code
- Files to modify
- Files to create
- Database changes
- API changes
- Workflow Designer
- Automation Runner / Event Engine

---

## After approval rule

Implement ONLY missing functionality (❌/🟡 gaps) — do not refactor ✅ modules.

---

## Next actions (to perform now)

1. Run second audit pass for universal workflow artifacts:
   - workflow_execution/workflow_definition/execution_history/retry_engine/scheduler
2. Search for notification/email/webhook integrations:
   - send email/notification modules, webhook module, CRM activity creation
3. Search for finance/payment/invoice related models and services:
   - payment transactions, invoice documents
4. Search for permissions enforcement patterns:
   - permission checks in controllers/services
5. Locate how domain state changes occur (order status, inventory updates, payment completion) so we can trigger workflows.

---

## Tracking

- [ ] Step 1 audit: notification/finance/crm/permission confirmations
- [ ] Step 2 final completion matrix
- [ ] Step 3 final “files modify/create + DB/API changes” deliverable
- [ ] Implement missing functionality only
