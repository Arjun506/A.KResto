# AK Business OS Design System

Welcome to the Design System documentation for **AK Business OS**.

---

## 1. Design Principles
- **Enterprise‑grade consistency** – Every UI element follows a unified visual language that scales across products and platforms.
- **Clarity & efficiency** – Prioritize legibility, intuitive affordances, and minimal cognitive load.
- **Scalable modularity** – Components are composable, theme‑aware, and adaptable to new use‑cases without breaking existing ones.
- **Accessibility first** – Built‑in contrast, focus, and interaction patterns meet WCAG 2.2 AA.
- **Performance‑ready** – Lightweight CSS, SVG icons, and CSS‑only animations ensure fast load times.
- **Design‑to‑code parity** – Tokens are defined in a single source of truth and can be exported to any technology stack.

---

## 2. Color Tokens
| Token | Light Mode Hex | Dark Mode Hex | Usage |
|-------|----------------|---------------|-------|
| **Primary** | `#0A6CFD` (Blue‑900) | `#3A9FFF` (Blue‑300) | Primary actions, links, active states |
| **Primary‑Hover** | `#0A5CCC` | `#4CB2FF` | Hover state for primary elements |
| **Secondary** | `#6C757D` (Gray‑600) | `#A5B1BB` (Gray‑400) | Secondary buttons, tertiary text |
| **Success** | `#28A745` | `#4CD26E` | Success messages, validation |
| **Warning** | `#FFC107` | `#FFD658` | Warning alerts, caution icons |
| **Error** | `#DC3545` | `#FF5A66` | Error states, destructive actions |
| **Background‑Light** | `#F8F9FA` | — | Page background in light mode |
| **Background‑Dark** | — | `#212529` | Page background in dark mode |
| **Surface‑Light** | `#FFFFFF` | — | Cards, modals, input containers |
| **Surface‑Dark** | — | `#2C2F33` | Same as above for dark theme |
| **Text‑Primary** | `#212529` | `#F8F9FA` | Main body copy |
| **Text‑Secondary** | `#495057` | `#CED4DA` | Secondary copy, placeholders |
| **Border‑Light** | `#DEE2E6` | — | Light mode dividers |
| **Border‑Dark** | — | `#4A4E52` | Dark mode dividers |

*All colors are defined as HSL variables for easy theming.*

---

## 3. Typography
| Token | Font‑Family | Size (rem) | Weight | Line‑Height | Letter‑Spacing |
|-------|-------------|------------|--------|-------------|----------------|
| **Display‑XL** | "Inter", sans-serif | 2.5 | 700 | 1.2 | -0.02em |
| **Display‑L** | "Inter" | 2.0 | 700 | 1.2 | -0.02em |
| **Heading‑1** | "Inter" | 1.75 | 600 | 1.3 | -0.01em |
| **Heading‑2** | "Inter" | 1.5 | 600 | 1.3 | -0.01em |
| **Heading‑3** | "Inter" | 1.25 | 600 | 1.4 | 0em |
| **Body‑Large** | "Inter" | 1.0 | 400 | 1.5 | 0em |
| **Body‑Regular** | "Inter" | 0.875 | 400 | 1.5 | 0em |
| **Caption** | "Inter" | 0.75 | 400 | 1.6 | 0.02em |
| **Button‑Label** | "Inter" | 0.875 | 600 | 1.4 | 0.01em |

### Font‑Family
- Primary: **Inter** – loaded via Google Fonts (`font-display: swap`).
- Fallback: system UI (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`).

---

## 4. Spacing (8px Grid)
All UI layout properties utilize multiples of 8px to maintain consistent layout rhythms:
- **`2` (8px):** Padding/margins on small widgets, buttons, and badges.
- **`4` (16px):** Padding on dashboard cards, input spacing.
- **`8` (32px):** Grid gaps, outer layout bounds.

### Responsive Breakpoints
- **Mobile (`sm`):** `<640px` (single column vertical list).
- **Tablet (`md`):** `640px - 1024px` (dual column structures).
- **Desktop (`lg`):** `>1024px` (dashboard layouts, sidebars).

---

## 5. UI Components Guidelines
- **Cards:** Backdrop filter, low opacity border, subtle drop shadow, hover translateY effect.
- **Buttons:** Base sizing, clear hover state changes, accessible outlines.
- **Tables:** Fixed column layouts, sorting indicators, empty state icons, and skeletons.
- **Forms:** Labels, validation error states, and helper text inputs.
