# Phase 29G — First Day Operator Checklist

This checklist guides the platform operator through monitoring the pilot business on launch day.

---

## 1. Monitoring Checks

- [ ] Check DB connection pool limits and Redis queue states in the morning.
- [ ] Monitor logs for key decryptions or auth failures.
- [ ] Confirm WebSockets are dispatching KDS tickets.
- [ ] Log customer orders total and confirm inventory adjustments reconcile to zero discrepancy.
- [ ] Check support queue for incoming high-severity tickets.
- [ ] Trigger an encrypted database backup at the end of the day.
