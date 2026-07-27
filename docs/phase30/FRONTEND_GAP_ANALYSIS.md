# Phase 30 — Frontend Gap Analysis

---

## Architectural & UX Deficit Mapping

1. **Design System Fragmentation**:
   - `packages/ui` contains core primitive primitives (`foundation.tsx`), but several pages in `apps/web` use ad-hoc inline Tailwind classes instead of uniform design tokens.
   - Light/Dark mode transitions need consistent CSS variable bindings across all Industry Pack routes.

2. **Mock Data Reliance in Executive Views**:
   - `/dashboard` (Owner Command Center), `/dashboard/ai-insights`, `/dashboard/finance`, and `/dashboard/logistics` rely heavily on local mock arrays.
   - Need clear separation between production data contracts and demo data fallbacks using standard loading/empty states.

3. **Customer OS Scope Expansion**:
   - Universal search across multiple vertical categories (Ride hailing, Hotel stays, Salon bookings, Home services) currently lacks a consolidated multi-vertical discovery UI.
   - Universal Activity Timeline requires a single unified component capable of rendering food, ride, stay, and service statuses seamlessly.

4. **Worker / Field Service UX Missing**:
   - Operational mobile workflows for room cleaning checklists, technician inspections, and delivery partner trip navigation require mobile-first UI patterns.

5. **Universal Chat UX Contracts**:
   - Chat interface for Customer ↔ Business and Customer ↔ Driver currently relies on client-side state without a unified messaging component.
