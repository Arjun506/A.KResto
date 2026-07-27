# Phase 26 — Mock Data Purge Audit

This audit inventories the locations of mock/demo/sample datasets across production and test pathways.

---

## 1. Mock Data Inventory

| File Path | Description | Class | Mitigation Status |
| :--- | :--- | :--- | :--- |
| `apps/web/app/dashboard/hotel/page.tsx` | Demo rooms list if backend is offline. | `DEMO_MODE` | Kept as offline sync fallback only. |
| `apps/web/app/dashboard/healthcare/emr/page.tsx` | Demo patient EMR details if backend offline. | `DEMO_MODE` | Kept as offline sync fallback only. |
| `apps/web/app/dashboard/logistics/page.tsx` | Demo shipment logs if backend offline. | `DEMO_MODE` | Kept as offline sync fallback only. |

---

## 2. Production Hardening Rules

- No mock revenue calculations, occupancy metrics, patient details, or vehicle locations are displayed to users unless the system is explicitly running in Demo/Sandbox mode.
- Offline indicators warn the user when data is loaded from cached fallbacks instead of active database streams.
