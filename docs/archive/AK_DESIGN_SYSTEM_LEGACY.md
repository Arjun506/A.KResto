# AK Business OS Design System

> **Note:** The Design System documentation has moved to `docs/design-system/overview.md`. Please refer to that location for the authoritative source.


---

## Design Principles

- **Enterprise‑grade consistency** – Every UI element follows a unified visual language that scales across products and platforms.
- **Clarity & efficiency** – Prioritize legibility, intuitive affordances, and minimal cognitive load.
- **Scalable modularity** – Components are composable, theme‑aware, and adaptable to new use‑cases without breaking existing ones.
- **Accessibility first** – Built‑in contrast, focus, and interaction patterns meet WCAG 2.2 AA.
- **Performance‑ready** – Lightweight CSS, SVG icons, and CSS‑only animations ensure fast load times.
- **Design‑to‑code parity** – Tokens are defined in a single source of truth and can be exported to any technology stack.

---

## Color Tokens

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

## Typography

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

## Spacing Scale

The spacing system follows a 4‑pixel base grid.

```scss
$spacing-unit: 4px;
$spacing-0: 0;
$spacing-1: $spacing-unit; // 4px
$spacing-2: $spacing-unit * 2; // 8px
$spacing-3: $spacing-unit * 3; // 12px
$spacing-4: $spacing-unit * 4; // 16px
$spacing-5: $spacing-unit * 5; // 20px
$spacing-6: $spacing-unit * 6; // 24px
$spacing-8: $spacing-unit * 8; // 32px
$spacing-10: $spacing-unit * 10; // 40px
$spacing-12: $spacing-unit * 12; // 48px
```

All margins, paddings, and gaps are expressed using the token name (e.g., `spacing-4`).

---

## Grid System

- **12‑column flex grid**
- Gutter: `spacing-4` (16 px) on both sides.
- Breakpoints:
  - **xs**: < 576 px – 1 column (full width)
  - **sm**: ≥ 576 px – 2 columns
  - **md**: ≥ 768 px – 4 columns
  - **lg**: ≥ 992 px – 8 columns
  - **xl**: ≥ 1200 px – 12 columns

Utility classes (e.g., `.col-6`) follow the pattern `col-{breakpoint?}-{span}`.

---

## Component Tokens
### Cards
- **Background**: `surface-light` / `surface-dark`
- **Border**: `border-light` / `border-dark`
- **Radius**: `spacing-2` (8 px)
- **Shadow**: `0 2px 8px rgba(0,0,0,0.08)` (light) / `0 2px 8px rgba(0,0,0,0.24)` (dark)
- **Padding**: `spacing-4`

### Buttons
| Variant | Background | Text | Border | Hover | Disabled |
|---------|------------|------|--------|-------|----------|
| **Primary** | `primary` | `#FFFFFF` | none | `primary‑hover` | `primary` @ 0.5 opacity |
| **Secondary** | `transparent` | `primary` | `primary` | `primary‑hover` (bg) | `primary` @ 0.3 opacity |
| **Success** | `success` | `#FFFFFF` | none | `success‑hover` | `success` @ 0.5 opacity |
| **Danger** | `error` | `#FFFFFF` | none | `error‑hover` | `error` @ 0.5 opacity |
- **Height**: `spacing-10` (40 px)
- **Radius**: `spacing-2`
- **Font**: `button-label`
- **Focus Ring**: `0 0 0 3px` with `primary` at 30 % opacity

### Inputs
- **Container**: `surface-light` / `surface-dark`
- **Border**: `border-light` / `border-dark`
- **Radius**: `spacing-1`
- **Padding**: `spacing-3`
- **Font**: `body-regular`
- **State Colors**: `primary` for focus, `error` for validation error, `success` for success state.
- **Placeholder**: `text-secondary`

### Tables
- **Header Background**: `surface-light` (light) / `surface-dark` (dark) with `text-primary` bold.
- **Row Hover**: `primary` at 5 % opacity background.
- **Border**: `border-light` / `border-dark`
- **Spacing**: Cell padding `spacing-3`.
- **Typography**: `body-regular` for cells, `body-large` for header.

### Charts
- **Palette**: Use primary, secondary, success, warning, error, plus neutral grays.
- **Font**: `body-regular` for axis labels, `caption` for tooltips.
- **Animation**: Fade‑in on load (0.3 s), easing `cubic‑bezier(0.4, 0, 0.2, 1)`.
- **Accessibility**: Provide `aria‑label` and high‑contrast color alternatives.

---

## Navigation Patterns

### Sidebar
- **Width**: `spacing-48` (192 px) for collapsed, `spacing-64` (256 px) for expanded.
- **Background**: `surface-dark` (dark mode) / `surface-light` (light mode).
- **Item Height**: `spacing-12` (48 px).
- **Active Indicator**: 4 px left border using `primary`.
- **Collapse/Expand animation**: slide‑right/left 0.25 s.

### Topbar
- **Height**: `spacing-12` (48 px).
- **Background**: `surface-light` / `surface-dark` with subtle shadow.
- **Logo Placement**: left, 24 px.
- **Action items**: spaced `spacing-4` apart, icons sized `spacing-6`.

### Dropdowns & Menus
- **Background**: `surface-light` / `surface-dark`
- **Shadow**: `0 4px 12px rgba(0,0,0,0.15)`
- **Item Height**: `spacing-10`
- **Hover**: `primary` at 6 % opacity.
- **Divider**: 1 px `border-light` / `border-dark`.

---

## Dialogs & Modals
- **Overlay**: `rgba(0,0,0,0.5)` (light) / `rgba(0,0,0,0.7)` (dark)
- **Container**: `surface-light` / `surface-dark`
- **Radius**: `spacing-3`
- **Padding**: `spacing-6`
- **Header**: `heading-3` + close icon aligned right.
- **Animation**: Scale from 0.95 to 1.0 with opacity fade (0.2 s).

---

## Forms
- **Layout**: Vertical stack, `spacing-4` between fields.
- **Label**: `body-large` bold, `text-primary`.
- **Helper Text**: `caption`, `text-secondary`.
- **Error Message**: `caption`, `error` color.
- **Submit Button**: Primary variant, full‑width on mobile.

---

## Icons
- **Source**: Custom SVG sprite generated from Material‑Design Icons.
- **Size Tokens**: `icon-xs` (12 px), `icon-sm` (16 px), `icon-md` (20 px), `icon-lg` (24 px), `icon-xl` (32 px).
- **Color**: Inherit `currentColor` – can be tinted via token (`text-primary`, `primary`, etc.).
- **Accessibility**: Provide `aria-hidden="true"` when decorative, `aria-label` when informative.

---

## Animation Rules
- **Easing**: `cubic‑bezier(0.4, 0, 0.2, 1)` (standard), `cubic‑bezier(0.2, 0, 0, 1)` for exit.
- **Duration Scale**:
  - **Fast**: 150 ms
  - **Medium**: 250 ms
  - **Slow**: 350 ms
- **Properties**: Only animate `opacity`, `transform`, `color`, `background-color`. No layout‑changing properties.
- **Reduced Motion**: Respect `prefers-reduced-motion`; set durations to 0ms and skip transforms.

---

## Accessibility Rules
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text.
- **Focus Indicators**: Visible `2px` outline with high‑contrast color (`primary` @ 30 % opacity).
- **Keyboard Navigation**: All interactive components reachable via `Tab` and have logical `Enter`/`Space` activation.
- **ARIA Roles**: Buttons (`role="button"`), dialogs (`role="dialog"` with `aria-modal="true"`), menus (`role="menu"`), menu items (`role="menuitem"`).
- **Screen Reader Labels**: Every control must have an accessible name (`aria-label` or associated `<label>`).
- **Form Validation**: Use `aria-invalid="true"` and associate error messages via `aria-describedby`.

---

## Theme Modes
### Light Mode
- Base background: `background-light`
- Primary text: `text-primary`
- Surfaces: `surface-light`
- Borders: `border-light`

### Dark Mode
- Base background: `background-dark`
- Primary text: `text-primary` (light variant)
- Surfaces: `surface-dark`
- Borders: `border-dark`
- **Switching**: CSS custom property `prefers-color-scheme` media query with JavaScript fallback for user preference stored in `localStorage`.

---

## Responsive Rules
- **Typography** scales with breakpoints using CSS clamp():
  ```css
  h1 { font-size: clamp(1.5rem, 2vw + 1rem, 2.5rem); }
  ```
- **Grid** auto‑adjusts columns as defined in the Grid System.
- **Touch Targets**: Minimum 44 × 44 dp.
- **Adaptive Components**: Buttons become full‑width on `xs` breakpoint; sidebar collapses to a hamburger menu.

---

## Component Naming Conventions
- **BEM‑style with token prefix**: `ak-[component]__[element]--[modifier]`
  - Example: `ak-button__icon--primary`.
- **Tokens**: Prefix all CSS variables with `--ak-` (e.g., `--ak-color-primary`).
- **Utility Classes**: `ak-u-` prefix (e.g., `ak-u-mt-4`).
- **JavaScript/HTML**: Use PascalCase for React‑like component names (even though we’re not providing React code) – e.g., `AKButton`, `AKCard` – to keep a consistent library API.

---

## Documentation Usage
- **Design Tokens** are exported as JSON (`design-tokens.json`) for integration with design tools such as Figma, Sketch, and code generators.
- **Component Library**: Each component is described with usage examples, markup snippets (HTML), and CSS class maps.
- **Versioning**: Semantic versioning (`MAJOR.MINOR.PATCH`). Increment `MAJOR` for breaking token changes.

---

## Example Markup Snippet (Button)
```html
<button class="ak-button ak-button--primary" aria-label="Save">
  <svg class="ak-icon ak-icon--md" aria-hidden="true"><use href="#icon-save"/></svg>
  Save
</button>
```

---

*This design system is intended to be the single source of truth for all AK Business OS UI projects. It can be consumed by any front‑end stack (HTML/CSS, Web Components, Vue, Angular, etc.) while preserving visual consistency and accessibility.*

---

*Generated on 2026‑07‑02.*
