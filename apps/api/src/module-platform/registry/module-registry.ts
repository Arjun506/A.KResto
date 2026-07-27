import { Injectable } from '@nestjs/common';

type SemverRange = string;

type SidebarItemDef = {
  moduleId: string;
  id: string;
  name: string;
  href: string;
  iconKey?: string;
  badge?: number;
  category?: string;
  requiredPermission?: string;
};

type WidgetDef = {
  moduleId: string;
  id: string;
  name: string;
  widgetKey: string;
  category?: string;
  requiredPermission?: string;
  featureFlagKey?: string;
  route?: string;
};

export type ModuleDefinition = {
  moduleId: string;
  moduleName: string;
  version: string;
  description: string;
  category: string;
  dependencies: Array<{ moduleId: string; minVersion?: SemverRange }>;
  industryCompatibility: string[];
  permissions: {
    actions: string[];
  };
  routes: Array<{
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  }>;
  sidebarItems: SidebarItemDef[];
  widgets: WidgetDef[];
  settings: Record<string, unknown>;
  featureFlags: Array<{ key: string; enabledByDefault?: boolean }>;
  licenseStatus: 'OPEN_SOURCE' | 'COMMERCIAL' | 'PROPRIETARY';
  subscriptionRequirements: Array<{ planTier: string; required: boolean }>;
};

const bootstrapModules: ModuleDefinition[] = [
  // Minimal placeholder modules so the platform is functional end-to-end.
  // Real modules should be added later (or by marketplace/industry packs).
  {
    moduleId: 'dashboard-home',
    moduleName: 'Dashboard Home',
    version: '1.0.0',
    description: 'Base dashboard widgets and navigation.',
    category: 'core',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['dashboard:read'] },
    routes: [{ path: '/dashboard', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'dashboard-home',
        id: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        iconKey: 'LayoutDashboard',
        category: 'General',
        requiredPermission: 'dashboard:read',
      },
    ],
    widgets: [
      {
        moduleId: 'dashboard-home',
        id: 'kpi-summary',
        name: 'KPI Summary',
        widgetKey: 'kpi-summary',
        category: 'Overview',
        requiredPermission: 'dashboard:read',
      },
    ],
    settings: {},
    featureFlags: [],
    licenseStatus: 'OPEN_SOURCE',
    subscriptionRequirements: [{ planTier: 'TRIAL', required: true }],
  },
  {
    moduleId: 'analytics',
    moduleName: 'Analytics',
    version: '1.0.0',
    description: 'Reports and analytics widgets.',
    category: 'analytics',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['analytics:read'] },
    routes: [{ path: '/dashboard/analytics', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'analytics',
        id: 'reports',
        name: 'Reports & Analytics',
        href: '/dashboard/analytics',
        iconKey: 'BarChart3',
        category: 'Analytics',
        requiredPermission: 'analytics:read',
      },
    ],
    widgets: [
      {
        moduleId: 'analytics',
        id: 'reports-widget',
        name: 'Reports Widget',
        widgetKey: 'reports',
        category: 'Analytics',
        requiredPermission: 'analytics:read',
      },
    ],
    settings: {},
    featureFlags: [],
    licenseStatus: 'OPEN_SOURCE',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'pos-terminal',
    moduleName: 'Point of Sale (POS)',
    version: '2.1.0',
    description:
      'Universal billing, table layouts, receipt printer pairing, and checkout terminal.',
    category: 'POS',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['pos:read', 'pos:write'] },
    routes: [{ path: '/dashboard/pos', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'pos-terminal',
        id: 'pos',
        name: 'Shop / Mall POS',
        href: '/dashboard/shop',
        iconKey: 'Layers',
        category: 'POS',
        requiredPermission: 'pos:read',
      },
    ],
    widgets: [],
    settings: { taxRate: 18, allowDiscount: true },
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
  {
    moduleId: 'inventory-manager',
    moduleName: 'Inventory Controller',
    version: '1.4.0',
    description:
      'Ingredient lists, raw stock alerts, purchase orders, and supplier catalogs.',
    category: 'Operations',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['inventory:read', 'inventory:write'] },
    routes: [{ path: '/dashboard/inventory', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'inventory-manager',
        id: 'inventory',
        name: 'Inventory / Stock',
        href: '/dashboard/inventory',
        iconKey: 'Package',
        category: 'Operations',
        requiredPermission: 'inventory:read',
      },
    ],
    widgets: [],
    settings: { alertThreshold: 10, currency: 'INR' },
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'crm-loyalty',
    moduleName: 'CRM & Loyalty Program',
    version: '1.2.0',
    description:
      'Track customer profiles, purchase history, reward points, and tier membership levels.',
    category: 'CRM',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['crm:read', 'crm:write'] },
    routes: [{ path: '/dashboard/customers', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'crm-loyalty',
        id: 'crm',
        name: 'Customers & Loyalty',
        href: '/dashboard/customers',
        iconKey: 'Users',
        category: 'Management',
        requiredPermission: 'crm:read',
      },
    ],
    widgets: [],
    settings: { pointsPerRupee: 0.1, welcomeBonus: 100 },
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
  {
    moduleId: 'ai-copilot',
    moduleName: 'AI Copilot Assistant',
    version: '1.0.0-beta',
    description:
      'Automate sales reports, auto-generate dish descriptions, and optimize printer setups.',
    category: 'AI Agents',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['ai:read', 'ai:write'] },
    routes: [],
    sidebarItems: [],
    widgets: [],
    settings: { modelName: 'gemini-1.5-flash', maxTokens: 512 },
    featureFlags: [],
    licenseStatus: 'PROPRIETARY',
    subscriptionRequirements: [{ planTier: 'ENTERPRISE', required: true }],
  },
  {
    moduleId: 'premium-dark-theme',
    moduleName: 'Premium Dark Skin Theme',
    version: '3.0.5',
    description: 'Sleek custom dark UI stylesheet for night operations.',
    category: 'Themes',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['themes:read'] },
    routes: [],
    sidebarItems: [],
    widgets: [],
    settings: { themePreset: 'glass-violet' },
    featureFlags: [],
    licenseStatus: 'OPEN_SOURCE',
    subscriptionRequirements: [{ planTier: 'TRIAL', required: true }],
  },
  {
    moduleId: 'retail-industry-pack',
    moduleName: 'Retail Operations Bundle',
    version: '1.0.0',
    description:
      'Preconfigured master data templates and barcodes for grocery/convenience setups.',
    category: 'Industry Packs',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['packs:read'] },
    routes: [],
    sidebarItems: [],
    widgets: [],
    settings: { enableBarcodes: true },
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
];

@Injectable()
export class ModuleRegistry {
  private readonly modulesById = new Map<string, ModuleDefinition>();

  constructor() {
    for (const m of bootstrapModules) {
      this.modulesById.set(m.moduleId, m);
    }
  }

  getModule(moduleId: string): ModuleDefinition {
    const mod = this.modulesById.get(moduleId);
    if (!mod) {
      throw new Error(`Unknown moduleId: ${moduleId}`);
    }
    return mod;
  }

  listAll(): ModuleDefinition[] {
    return Array.from(this.modulesById.values());
  }
}
