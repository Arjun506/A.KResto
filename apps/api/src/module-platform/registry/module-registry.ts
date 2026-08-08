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

export type IndustryPackDefinition = {
  industryId: string;
  name: string;
  description: string;
  recommendedModules: string[];
  defaultFeatureFlags: Record<string, boolean>;
  workflows: string[];
};

export const SUPPORTED_INDUSTRIES: IndustryPackDefinition[] = [
  {
    industryId: 'RESTAURANT',
    name: 'Restaurant & Dining',
    description: 'Fine dining, QSR, cafes, cloud kitchens, and bar operations.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'kds-kitchen', 'crm-loyalty', 'workforce-scheduler', 'delivery-dispatch'],
    defaultFeatureFlags: { DINING_TABLES: true, KDS: true, RECIPES: true, ONLINE_ORDERING: true },
    workflows: ['TABLE_RESERVATION', 'ORDER_TAKING', 'KITCHEN_DISPATCH', 'BILLING_CHECKOUT'],
  },
  {
    industryId: 'HOTEL',
    name: 'Hotel & Hospitality',
    description: 'Guest room booking, housekeeping management, front desk, and room service.',
    recommendedModules: ['hotel-pms', 'pos-terminal', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { ROOM_BOOKINGS: true, HOUSEKEEPING: true, FRONT_DESK: true },
    workflows: ['ROOM_RESERVATION', 'CHECK_IN', 'HOUSEKEEPING_TASK', 'ROOM_SERVICE', 'CHECK_OUT'],
  },
  {
    industryId: 'RETAIL',
    name: 'Retail & Supermarket',
    description: 'Barcode scanning POS, multi-category inventory, supplier purchase orders.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { BARCODE_SCANNING: true, BATCH_EXPIRY: true, LOYALTY_LEDGER: true },
    workflows: ['BARCODE_CHECKOUT', 'PURCHASE_ORDER_RECEIVING', 'STOCK_AUDIT', 'REFUND'],
  },
  {
    industryId: 'GROCERY',
    name: 'Grocery & Superstore',
    description: 'Perishable goods management, weight scale billing, and express checkout.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'crm-loyalty', 'delivery-dispatch'],
    defaultFeatureFlags: { WEIGHT_SCALE: true, EXPIRY_ALERTS: true, HOME_DELIVERY: true },
    workflows: ['COUNTER_CHECKOUT', 'EXPRESS_DELIVERY', 'STOCK_REORDERS'],
  },
  {
    industryId: 'SALON',
    name: 'Salon, Spa & Beauty',
    description: 'Stylist appointment scheduling, service packages, and customer preferences.',
    recommendedModules: ['salon-booking', 'pos-terminal', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { APPOINTMENT_CALENDAR: true, STYLIST_COMMISSION: true },
    workflows: ['SERVICE_BOOKING', 'STYLIST_ASSIGNMENT', 'SERVICE_CHECKOUT'],
  },
  {
    industryId: 'HEALTHCARE',
    name: 'Healthcare & Clinic',
    description: 'Doctor appointment scheduling, patient EMR history, and billing.',
    recommendedModules: ['healthcare-emr', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { PATIENT_EMR: true, DOCTOR_ROSTER: true, PRESCRIPTIONS: true },
    workflows: ['PATIENT_REGISTRATION', 'DOCTOR_CONSULTATION', 'PRESCRIPTION_BILLING'],
  },
  {
    industryId: 'PHARMACY',
    name: 'Pharmacy & Medical Store',
    description: 'Batch tracking, drug expiry alerts, prescription matching, and billing.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'crm-loyalty'],
    defaultFeatureFlags: { DRUG_BATCHING: true, PRESCRIPTION_AUDIT: true },
    workflows: ['PRESCRIPTION_DISPENSING', 'MEDICINE_BILLING', 'BATCH_REORDER'],
  },
  {
    industryId: 'LOGISTICS',
    name: 'Logistics & Fleet Dispatch',
    description: 'Route optimization, parcel tracking, driver dispatching, and proof of delivery.',
    recommendedModules: ['delivery-dispatch', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { DRIVER_DISPATCH: true, ROUTE_OPTIMIZATION: true, PROOF_OF_DELIVERY: true },
    workflows: ['PARCEL_INTAKE', 'DRIVER_ASSIGNMENT', 'IN_TRANSIT_TRACKING', 'DELIVERY_CONFIRMATION'],
  },
  {
    industryId: 'DRY_CLEANING',
    name: 'Dry Cleaning & Laundry',
    description: 'Garment intake tagging, processing tracking, store pickup, and delivery.',
    recommendedModules: ['dry-cleaning-core', 'pos-terminal', 'crm-loyalty', 'delivery-dispatch'],
    defaultFeatureFlags: { GARMENT_TAGGING: true, PROCESSING_WORKFLOW: true, PICKUP_DELIVERY: true },
    workflows: ['GARMENT_INTAKE', 'PROCESSING_CLEANING', 'QUALITY_CHECK', 'STORE_PICKUP_DELIVERY'],
  },
  {
    industryId: 'LAUNDRY',
    name: 'Commercial Laundry',
    description: 'Linen weight processing, commercial client billing, and pickup routes.',
    recommendedModules: ['dry-cleaning-core', 'pos-terminal', 'crm-loyalty', 'delivery-dispatch'],
    defaultFeatureFlags: { COMMERCIAL_WEIGHT: true, BULK_PROCESSING: true },
    workflows: ['BULK_INTAKE', 'WASH_DRY_FOLD', 'DISPATCH_DELIVERY'],
  },
  {
    industryId: 'REPAIR_SERVICE',
    name: 'Device & Equipment Repair',
    description: 'Repair ticket tracking, spare parts inventory, technician assignment, and warranty.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { REPAIR_TICKETS: true, SPARE_PARTS: true },
    workflows: ['DEVICE_INTAKE', 'DIAGNOSIS', 'REPAIR_EXECUTION', 'CUSTOMER_PICKUP'],
  },
  {
    industryId: 'PROFESSIONAL_SERVICES',
    name: 'Consulting & Legal Services',
    description: 'Client retainer billing, time tracking, appointment consultation, and invoicing.',
    recommendedModules: ['crm-loyalty', 'workforce-scheduler'],
    defaultFeatureFlags: { TIME_TRACKING: true, RETAINER_INVOICING: true },
    workflows: ['CLIENT_ONBOARDING', 'TIME_LOGGING', 'INVOICE_GENERATION'],
  },
  {
    industryId: 'MANUFACTURING',
    name: 'Light Manufacturing & Assembly',
    description: 'Bill of materials (BOM), production batch tracking, and raw material reorders.',
    recommendedModules: ['inventory-manager', 'workforce-scheduler'],
    defaultFeatureFlags: { BOM_RECIPES: true, PRODUCTION_BATCHES: true },
    workflows: ['WORK_ORDER_CREATION', 'MATERIAL_ISSUE', 'PRODUCTION_ASSEMBLY'],
  },
  {
    industryId: 'WHOLESALE',
    name: 'Wholesale B2B Distribution',
    description: 'Bulk B2B pricing, credit line terms, wholesale invoicing, and dispatch.',
    recommendedModules: ['pos-terminal', 'inventory-manager', 'crm-loyalty', 'delivery-dispatch'],
    defaultFeatureFlags: { B2B_CREDIT_TERMS: true, BULK_PRICING_TIERS: true },
    workflows: ['B2B_QUOTATION', 'CREDIT_APPROVAL', 'BULK_DISPATCH'],
  },
];

const bootstrapModules: ModuleDefinition[] = [
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
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'OPEN_SOURCE',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'pos-terminal',
    moduleName: 'Point of Sale (POS)',
    version: '2.1.0',
    description: 'Universal billing, table layouts, receipt printer pairing, and checkout terminal.',
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
    description: 'Ingredient lists, raw stock alerts, purchase orders, and supplier catalogs.',
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
    description: 'Track customer profiles, purchase history, reward points, and tier membership levels.',
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
    moduleId: 'workforce-scheduler',
    moduleName: 'Workforce & Staff Operations',
    version: '1.0.0',
    description: 'Multi-branch staff assignments, shift scheduling, punch clock-in/out, and leave management.',
    category: 'Workforce',
    dependencies: [],
    industryCompatibility: ['*'],
    permissions: { actions: ['staff:read', 'staff:write'] },
    routes: [{ path: '/dashboard/staff', method: 'GET' }],
    sidebarItems: [
      {
        moduleId: 'workforce-scheduler',
        id: 'staff',
        name: 'Staff & Roster',
        href: '/dashboard/staff',
        iconKey: 'UserCheck',
        category: 'Management',
        requiredPermission: 'staff:read',
      },
    ],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
  {
    moduleId: 'kds-kitchen',
    moduleName: 'Kitchen Display System (KDS)',
    version: '1.5.0',
    description: 'Real-time order ticket dispatch for chefs and kitchen preparation stations.',
    category: 'Operations',
    dependencies: [{ moduleId: 'pos-terminal' }],
    industryCompatibility: ['RESTAURANT'],
    permissions: { actions: ['kitchen:read', 'kitchen:write'] },
    routes: [{ path: '/dashboard/kitchen', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
  {
    moduleId: 'delivery-dispatch',
    moduleName: 'Delivery & Logistics Dispatch',
    version: '1.1.0',
    description: 'Route optimization, driver assignment, and live delivery tracking.',
    category: 'Logistics',
    dependencies: [{ moduleId: 'crm-loyalty' }],
    industryCompatibility: ['RESTAURANT', 'GROCERY', 'LOGISTICS', 'DRY_CLEANING', 'LAUNDRY', 'WHOLESALE'],
    permissions: { actions: ['logistics:read', 'logistics:write'] },
    routes: [{ path: '/dashboard/logistics', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'dry-cleaning-core',
    moduleName: 'Dry Cleaning & Garment Processing',
    version: '1.0.0',
    description: 'Garment intake tagging, processing status tracking, quality inspection, and store pickup.',
    category: 'Industry Packs',
    dependencies: [{ moduleId: 'pos-terminal' }, { moduleId: 'crm-loyalty' }],
    industryCompatibility: ['DRY_CLEANING', 'LAUNDRY'],
    permissions: { actions: ['drycleaning:read', 'drycleaning:write'] },
    routes: [{ path: '/dashboard/dry-cleaning', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'STARTER', required: true }],
  },
  {
    moduleId: 'hotel-pms',
    moduleName: 'Hotel Property Management (PMS)',
    version: '1.0.0',
    description: 'Room booking engine, front desk check-in, housekeeping tasks, and folio billing.',
    category: 'Industry Packs',
    dependencies: [{ moduleId: 'pos-terminal' }],
    industryCompatibility: ['HOTEL'],
    permissions: { actions: ['hotel:read', 'hotel:write'] },
    routes: [{ path: '/dashboard/hotel', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'healthcare-emr',
    moduleName: 'Healthcare EMR & Consultations',
    version: '1.0.0',
    description: 'Patient medical record history, doctor appointment scheduling, and electronic prescriptions.',
    category: 'Industry Packs',
    dependencies: [{ moduleId: 'crm-loyalty' }],
    industryCompatibility: ['HEALTHCARE', 'PHARMACY'],
    permissions: { actions: ['healthcare:read', 'healthcare:write'] },
    routes: [{ path: '/dashboard/healthcare', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
    featureFlags: [],
    licenseStatus: 'COMMERCIAL',
    subscriptionRequirements: [{ planTier: 'PROFESSIONAL', required: true }],
  },
  {
    moduleId: 'salon-booking',
    moduleName: 'Salon & Stylist Scheduling',
    version: '1.0.0',
    description: 'Beauty appointment calendar, stylist commission tracking, and service catalog.',
    category: 'Industry Packs',
    dependencies: [{ moduleId: 'crm-loyalty' }],
    industryCompatibility: ['SALON'],
    permissions: { actions: ['salon:read', 'salon:write'] },
    routes: [{ path: '/dashboard/salon', method: 'GET' }],
    sidebarItems: [],
    widgets: [],
    settings: {},
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
