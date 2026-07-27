# Phase 30 Wave 1 — Accessibility Baseline

---

## Accessibility Standards (WCAG 2.1 Level AA Targeting)

- **Keyboard Navigation**: All interactive elements (Buttons, Inputs, Modals, Switches, Tabs) support native `Tab`, `Space`, `Enter`, and `Escape` key handling.
- **Focus Rings**: Standardized `focus-visible:ring-2 focus-visible:ring-indigo-500` rings across shared primitives.
- **ARIA Labeling**: Form controls bind `aria-describedby` to error messages and `aria-checked` to custom switches.
- **Screen Reader Support**: Decorative icons include `aria-hidden="true"`, buttons without text labels require `aria-label`.
