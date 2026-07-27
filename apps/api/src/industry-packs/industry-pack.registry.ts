import { Injectable } from '@nestjs/common';

export type IndustryPackModuleDef = {
  moduleId: string;
};

export type IndustryPackSidebarDef = Record<string, unknown>;
export type IndustryPackWidgetDef = Record<string, unknown>;
export type IndustryPackPermissionDef = Record<string, unknown>;

export type IndustryPackDefinition = {
  industryKey: string;
  packName: string;
  version: string;
  status: string;
  enabled: boolean;
  description: string;

  modules: IndustryPackModuleDef[];
  sidebar: IndustryPackSidebarDef;
  widgets: IndustryPackWidgetDef;
  permissions: IndustryPackPermissionDef;
};

@Injectable()
export class IndustryPackRegistry {
  private readonly packs = new Map<string, IndustryPackDefinition>();

  constructor() {
    // 1. Restaurant Industry Pack
    this.registerPack({
      industryKey: 'RESTAURANT',
      packName: 'Restaurant',
      version: '1.0',
      status: 'Installed',
      enabled: true,
      description:
        'Restaurant Industry Pack for hospitality businesses, enabling POS billing counter, tables ordering, bookings, and reservations.',
      modules: [
        { moduleId: 'pos-terminal' },
        { moduleId: 'inventory-manager' },
        { moduleId: 'crm-loyalty' },
        { moduleId: 'ai-copilot' },
        { moduleId: 'premium-dark-theme' },
      ],
      sidebar: {
        navigation: 'Restaurant',
      },
      widgets: {
        defaultWidgets: ['kpi-summary'],
      },
      permissions: {
        scope: 'Restaurant.*',
      },
    });

    // 2. Retail Industry Pack
    this.registerPack({
      industryKey: 'RETAIL',
      packName: 'Retail',
      version: '1.0',
      status: 'Available',
      enabled: false,
      description:
        'Retail Operations Pack featuring barcode scanner POS billing counters, SKU stock tracking, and supplier portals.',
      modules: [
        { moduleId: 'pos-terminal' },
        { moduleId: 'inventory-manager' },
        { moduleId: 'crm-loyalty' },
      ],
      sidebar: {
        navigation: 'Retail',
      },
      widgets: {
        defaultWidgets: ['kpi-summary'],
      },
      permissions: {
        scope: 'Retail.*',
      },
    });

    // 3. Hotel Industry Pack
    this.registerPack({
      industryKey: 'HOTEL',
      packName: 'Hotel',
      version: '1.0',
      status: 'Available',
      enabled: false,
      description:
        'Hotel Operations Pack featuring room check-in check-out lists, room occupancy stats, and housekeeping schedules.',
      modules: [{ moduleId: 'crm-loyalty' }],
      sidebar: {
        navigation: 'Hotel',
      },
      widgets: {
        defaultWidgets: ['kpi-summary'],
      },
      permissions: {
        scope: 'Hotel.*',
      },
    });

    // 4. Clinic Industry Pack
    this.registerPack({
      industryKey: 'CLINIC',
      packName: 'Clinic',
      version: '1.0',
      status: 'Available',
      enabled: false,
      description:
        'Clinic Operations Pack featuring patient OPD consultations lists, doctor schedule calendars, and pharmacy inventory.',
      modules: [{ moduleId: 'crm-loyalty' }],
      sidebar: {
        navigation: 'Clinic',
      },
      widgets: {
        defaultWidgets: ['kpi-summary'],
      },
      permissions: {
        scope: 'Clinic.*',
      },
    });
  }

  registerPack(def: IndustryPackDefinition) {
    this.packs.set(def.industryKey, def);
  }

  getPack(industryKey: string): IndustryPackDefinition {
    const pack = this.packs.get(industryKey);
    if (!pack) throw new Error(`Unknown industry pack: ${industryKey}`);
    return pack;
  }

  listAll(): IndustryPackDefinition[] {
    return Array.from(this.packs.values());
  }
}
