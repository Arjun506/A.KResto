# Design Rules & UI/UX Standards

This document establishes the user interface guidelines for **AK Business OS** applications.

## 1. Aesthetic Identity

- **Enterprise Quality:** Draw inspiration from Stripe, Linear, and Notion. Interfaces should look sleek, clean, modern, and uncluttered.
- **Glassmorphism & Gradients:** Apply subtle gradients and glassmorphism (backdrop filters with low opacity borders) for dashboard layouts, cards, and modal components.
- **Micro-Animations:** Use framer-motion transitions for hovers, route loading, sidebar toggles, and notification alerts. Keep animations short (150ms–300ms) and smooth.

## 2. Colors, Spacing & Layout

- **Unified Color Palette:** Rely on Tailwind HSL colors. Avoid raw hex colors. Maintain a core palette of neutrals, primary brand colors, and functional colors (success, danger, alert).
- **Responsive Flex/Grid:** Design with mobile-first layouts. Grids must collapse from multi-column layouts to single columns automatically. Use flexbox wrap options where appropriate.
- **Spacing Grid:** All element spacing, padding, and margins must utilize an 8px grid (e.g. `p-2` for 8px, `p-4` for 16px, `p-8` for 32px).

## 3. Accessibility & State Design

- **ARIA Compliant:** Enforce ARIA labels on all icons and interactive items lacking text elements. Check that focus outlines are visible during keyboard navigation.
- **Loading & Empty States:** Always design custom skeletons for async data fetching. Empty lists must display descriptive, actionable placeholders prompting the user to create data.
- **Dark Mode Support:** Keep tailwind `dark:` variant fully aligned across components. Avoid high-contrast pure black and pure white; utilize shades of slate, zinc, and off-white.
