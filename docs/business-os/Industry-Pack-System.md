# Industry Pack System

This document outlines the registration and loader systems for Business OS Industry Packs.

## Industry Pack Definition

An Industry Pack is a declarative bundle that configures a business workspace. It registers itself via the `IndustryPackRegistry` and exposes key metadata to the platform.

```typescript
export type IndustryPackDefinition = {
  industryKey: string;     // Unique uppercase identifier (e.g. 'RESTAURANT', 'RETAIL')
  packName: string;        // Human-readable pack name
  version: string;         // Semantic version string
  status: string;          // Current state ('Installed', 'Not Installed')
  enabled: boolean;        // Active enablement flag
  description: string;     // Short description of the business vertical
  
  modules: { moduleId: string }[]; // Dependency list of core/marketplace modules
  sidebar: {
    navigation: string;    // Sidebar navigation group name
  };
  widgets: {
    defaultWidgets: string[]; // Dashboard overview widgets list
  };
  permissions: {
    scope: string;         // Wildcard permission scope (e.g. 'Restaurant.*')
  };
};
```

## Pack Registration

All packs register themselves during the bootstrap of the `IndustryPackRegistry` service. Future packs (like Retail or Hotel) are registered simply by adding their definitions to the map.

```typescript
this.registerPack({
  industryKey: 'RESTAURANT',
  packName: 'Restaurant',
  version: '1.0',
  status: 'Installed',
  enabled: true,
  description: 'Restaurant Industry Pack for hospitality setups...',
  modules: [
    { moduleId: 'pos-terminal' },
    { moduleId: 'inventory-manager' }
  ],
  sidebar: { navigation: 'Restaurant' },
  widgets: { defaultWidgets: ['kpi-summary'] },
  permissions: { scope: 'Restaurant.*' }
});
```
