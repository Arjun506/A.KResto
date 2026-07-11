# AK Business OS – Industry Pack System

---

## 1. What is an Industry Pack?
An **Industry Pack** is a lightweight, plug‑in layer that tailors the **Core Platform** to the specific operational, regulatory, and experiential needs of a vertical market.  It **does not modify** the Core codebase; instead it uses declarative configuration, optional modules, and extensible UI components that are discovered at runtime.

### Core Principles
| Principle | Explanation |
|-----------|-------------|
| **Reusability** | All core services (Authentication, CRM, Inventory, Accounting, AI, etc.) remain untouched. The pack only adds or overrides metadata. |
| **Isolation** | Packs are packaged as independent bundles with their own versioning. Enabling a pack merely registers its manifest with the Module Engine. |
| **Extensibility** | New verticals can be introduced by shipping a new pack – no core recompilation, no database schema changes in the Core. |
| **Governance** | Each pack declares required Core modules, optional extensions, and minimum version constraints, ensuring safe coexistence. |

---

## 2. Catalog of Standard Industry Packs
| Industry | Identifier | Core Modules Reused | Typical Custom Additions |
|----------|------------|----------------------|------------------------|
| **Restaurant** | `restaurant` | POS, Inventory, CRM, Payroll, HR, AI (forecast, menu‑optimization) | Table‑management UI, reservation engine, kitchen display, food‑prep workflow |
| **Retail** | `retail` | POS, Inventory, Accounting, Marketing, AI (recommendations) | Loyalty program, in‑store promotions, barcode scanner integration |
| **Supermarket** | `supermarket` | Inventory, POS, Accounting, AI (demand forecasting) | Bulk‑pricing rules, shelf‑planogram dashboards, perishable‑expiry alerts |
| **Hotel** | `hotel` | CRM, Accounting, HR, AI (pricing optimizer) | Room‑booking engine, housekeeping workflow, property‑management reports |
| **Salon** | `salon` | CRM, Scheduling, POS, Payroll, AI (staffing) | Service catalog, appointment calendar, client‑history dashboards |
| **Healthcare** | `healthcare` | HR, Payroll, Accounting, AI (predictive analytics) | Patient record module, compliance audit reports, appointment workflow |
| **Education** | `education` | HR, Accounting, CRM, AI (student‑success) | Course management, enrollment workflow, grade‑report dashboards |
| **Warehouse** | `warehouse` | Inventory, Purchase, AI (routing) | Receiving dock UI, bin‑location heat‑maps, order‑picking workflow |
| **Manufacturing** | `manufacturing` | Inventory, Purchase, Accounting, AI (yield prediction) | Bill‑of‑Materials (BOM) manager, production‑line dashboard, quality‑control reports |
| **Corporate** | `corporate` | HR, Payroll, Finance, AI (budgeting) | Organizational chart, expense‑approval workflow, multi‑entity consolidation |
| **Services** | `services` | CRM, Billing, AI (resource‑allocation) | Service‑ticketing, SLA monitoring, consultant‑time‑tracking |
| **Future Industries** | `future-<name>` | Same Core set, plus any new optional modules | Custom pack built by partners or internal teams |

---

## 3. Pack Structure (Declarative Manifest)
Each pack ships a **`pack.json`** manifest that the Module Engine reads at registration.  The manifest contains:
```json
{
  "id": "restaurant",
  "name": "Restaurant Pack",
  "version": "1.3.0",
  "coreDependencies": ["pos", "inventory", "crm", "payroll", "hr", "ai"],
  "optionalModules": ["reservation", "kitchen_display"],
  "dashboard": "restaurant_dashboard.json",
  "reports": ["sales_by_shift.json", "table_turnover.json"],
  "permissions": "restaurant_permissions.json",
  "workflows": "restaurant_workflows.json",
  "settings": "restaurant_settings.json"
}
```
*The manifest is pure JSON – no code*; the Module Engine interprets it to wire up the pack.

---

## 4. Industry Configuration
### 4.1 Core Configuration Overrides
- **Tax regimes**, **currency**, **locale** are overridden in the pack’s `settings.json`.
- Example: Supermarket pack sets default tax rates per product category.

### 4.2 Feature Flags
- Packs can enable/disable Core features via flags (e.g., `pos.enableTableManagement=true`).
- Flags are stored in the tenant’s **Feature Flag Service**, scoped per pack.

---

## 5. Custom Modules
A pack may **bundle optional modules** that are not part of the Core but are loaded only when the pack is enabled.
- **Module Types**: UI component, micro‑service, background worker.
- **Registration**: The pack manifest lists module IDs; the Module Engine registers them with the same lifecycle as Core modules (enable/disable, versioning).
- **Isolation**: Each custom module runs in its own container and can depend on Core APIs only.

**Examples**:
- `reservation` module for Restaurants (tables, time‑slots). 
- `kitchen_display` module that streams order tickets to kitchen screens.
- `loyalty` module for Retail.

---

## 6. Custom Dashboards
- Pack provides a **Dashboard Definition** (`dashboard.json`) describing layout, widgets, and data sources.
- Widgets reference Core module APIs (e.g., `GET /api/v1/pos/sales?period=day`).
- The UI runtime reads the JSON and renders a **tenant‑specific home page**.
- Packs can also ship **theme tokens** (colors, icons) to brand the UI for the vertical.

---

## 7. Custom Reports
- Reports are defined in **report templates** (SQL or analytical DSL) that the Report Engine executes against the shared data lake.
- Pack manifest lists report IDs; they become available under the **Reports** menu.
- Reports can include **industry‑specific KPIs** (e.g., *Table Turnover Rate* for Restaurants, *Shelf‑Stock Age* for Supermarkets).

---

## 8. Custom Permissions
- Packs extend the global permission catalog with **domain‑specific actions**.
- A `permissions.json` file maps actions to roles (e.g., `restaurant:table:manage`).
- The Permission Engine merges these into the RBAC matrix; admins can assign them via the **Roles & Policies** UI.
- Sensitive actions (e.g., `restaurant:reservation:cancel`) can be flagged as *critical* to require MFA.

---

## 9. Custom Workflows
- Packs ship **workflow definitions** (`workflow.yaml`) that the Automation Engine loads.
- Workflows are **event‑driven**; they can listen to Core events (e.g., `order.completed`) and trigger pack‑specific actions.
- Example: In the Salon pack, when a *service completed* event fires, a **follow‑up email** workflow is triggered automatically.
- Workflows are versioned alongside the pack, allowing safe upgrades.

---

## 10. Custom Settings
- Packs expose a **settings schema** (`settings.json`) that populates the **Settings UI** with industry‑specific fields.
- Settings are stored per tenant and can be used by modules at runtime (e.g., default service duration for Salon).
- Validation rules are declared in the schema, ensuring data integrity.

---

## 11. Adding a New Industry Pack – Zero Core Changes
1. **Create Pack Manifest** – Define `id`, `coreDependencies`, optional modules, dashboards, etc.
2. **Develop Optional Modules (if any)** – They are packaged as independent containers and published to the internal module registry.
3. **Define UI Artifacts** – Dashboard, reports, settings, permissions – all expressed as JSON/YAML.
4. **Package & Publish** – Upload the pack as a **Marketplace extension** under the *Industry Pack* category.
5. **Tenant Enrollment** – An admin selects the pack from the **Industry Catalog** UI; the Module Engine validates dependencies and enables the pack.
6. **Runtime Activation** – The engine registers the pack’s optional modules, loads dashboards, injects permission entries, and activates workflows.

Because the Core Platform only sees the pack as a **metadata bundle**, no source‑code modifications are required.  All versioning, dependency checks, and runtime wiring are handled by the existing **Module Engine**.

---

## 12. Governance & Lifecycle of Packs
| Lifecycle Stage | Action |
|-----------------|--------|
| **Draft** | Pack author creates manifest, optional modules, UI artifacts. |
| **Validation** | Marketplace connector runs automated integration tests (API contracts, schema validation). |
| **Publish** | Pack becomes available in the Industry Catalog with a semantic version. |
| **Enable** | Tenant admin enables the pack; Module Engine resolves dependencies and activates resources. |
| **Upgrade** | MINOR/PATCH upgrades are auto‑applied; MAJOR upgrades require admin approval and migration checklist. |
| **Deprecation** | After 12 months of a newer MAJOR, the pack is marked deprecated; tenants receive a migration guide. |

---

## 13. Summary
The **Industry Pack System** empowers AK Business OS to serve a broad spectrum of vertical markets while keeping the **Core Platform** immutable and stable.  By leveraging declarative manifests, optional modules, and the existing Module Engine, new industries can be introduced rapidly, with custom dashboards, reports, permissions, workflows, and settings, all governed through the same lifecycle mechanisms that manage core modules.

---

*Document generated on 2026‑07‑02.*
