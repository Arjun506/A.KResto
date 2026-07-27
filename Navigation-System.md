# Navigation System

Handles rendering of workspace sidebars and headers based on active modules and roles context.

## Flow
1. Fetch active modules for the tenant.
2. Filter sidebar items registered by enabled modules.
3. Apply RBAC checks on individual navigation route options.
4. Render layout.
