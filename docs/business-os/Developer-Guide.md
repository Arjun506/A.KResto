# Industry Pack Developer Guide

This guide explains how to build and register a new Industry Pack (e.g. Retail, Grocery, Hotel, Clinic) inside Business OS.

## Step 1: Create the Pack Directory
Create a folder for the pack config under `industry-packs/`:
```bash
mkdir -p industry-packs/retail
```

## Step 2: Declare the Pack Configuration
In the pack directory, create a definition file:
```typescript
import { IndustryPackDefinition } from '../../src/industry-packs/industry-pack.registry';

export const retailPackDefinition: IndustryPackDefinition = {
  industryKey: 'RETAIL',
  packName: 'Retail',
  version: '1.0',
  status: 'Installed',
  enabled: true,
  description: 'Retail Industry Pack featuring barcode lookup and SKU stock tracking.',
  modules: [
    { moduleId: 'pos-terminal' },
    { moduleId: 'inventory-manager' }
  ],
  sidebar: {
    navigation: 'Retail'
  },
  widgets: {
    defaultWidgets: ['kpi-summary']
  },
  permissions: {
    scope: 'Retail.*'
  }
};
```

## Step 3: Register in the Registry
Import your definition and pass it to `registerPack` inside the `IndustryPackRegistry` constructor:
```typescript
import { retailPackDefinition } from '../../industry-packs/retail/pack';

this.registerPack(retailPackDefinition);
```
Once registered, the onboarding wizard and settings portal will dynamically resolve this pack when users select the "Retail" industry.
