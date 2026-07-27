# Phase 30 Wave 1 — Shell Architecture

---

## Universal Application Shell Specifications

The Universal Application Shell (`UniversalAppShell`) provides a unified layout container for all 5 platform sub-applications:

1. **Business OS**: Left sidebar navigation, top bar with workspace selector & connectivity indicators.
2. **Customer OS**: Mobile-first bottom nav bar or clean header discovery bar.
3. **Worker OS**: Mobile task queue layout with quick action buttons.
4. **Partner OS**: Driver/vendor portal header & trip status bar.
5. **Super Admin OS**: Platform administration navigation & system status telemetry.

---

### Core Sub-components
- `Sidebar`: Dynamic, role- & pack-aware navigation drawer.
- `TopBar`: Header with search trigger, notifications drawer, theme toggle, & profile menu.
- `Breadcrumbs`: Dynamic route path indicator.
- `ConnectivityIndicator`: Real-time AK Connect network state banner (Online, Local Network, Nearby, Offline).
