# Phase 31 Wave 4 — Resource Availability Engine

---

## Server-Calculated Availability Pipeline

```
Available Slots = Operating Hours
  - Blocked Periods (Maintenance)
  - Existing Confirmed Bookings
  - Buffer / Turnaround Duration
```

- **Server-Authoritative Validation**: Availability is re-calculated server-side during checkout; client availability claims are not trusted.
