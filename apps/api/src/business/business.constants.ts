export type IndustryPack = {
  id: string;
  label: string;
  description: string;
  modules: string[];
};

export type CurrencyOption = {
  code: string;
  label: string;
  symbol: string;
};

export type TimezoneOption = {
  id: string;
  label: string;
  offset: string;
};

export const SUPPORTED_INDUSTRY_IDS = [
  'RESTAURANT',
  'RETAIL',
  'SALON',
  'CORPORATE',
] as const;

export type SupportedIndustryId = (typeof SUPPORTED_INDUSTRY_IDS)[number];

export const SUPPORTED_INDUSTRIES: IndustryPack[] = [
  {
    id: 'RESTAURANT',
    label: 'Restaurant / Hospitality',
    description: 'Enables KOTs, tables, bookings, menus, and POS.',
    modules: [
      'pos',
      'crm',
      'inventory',
      'analytics',
      'reservations',
      'kitchen',
    ],
  },
  {
    id: 'RETAIL',
    label: 'Retail / Commerce',
    description: 'Enables product catalogs, inventory control, and retail POS.',
    modules: ['pos', 'crm', 'inventory', 'analytics', 'products', 'sales'],
  },
  {
    id: 'SALON',
    label: 'Salon / Wellness',
    description:
      'Enables stylists booking calendars, reservations, and customer CRM.',
    modules: ['pos', 'crm', 'reservations', 'analytics'],
  },
  {
    id: 'CORPORATE',
    label: 'Corporate / Office',
    description:
      'Enables administrative analytics, tracking, and customer CRM.',
    modules: ['crm', 'analytics'],
  },
];

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', label: 'Saudi Riyal', symbol: '﷼' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
];

export const SUPPORTED_TIMEZONES: TimezoneOption[] = [
  { id: 'UTC', label: 'UTC', offset: '+00:00' },
  { id: 'America/New_York', label: 'Eastern Time (US)', offset: '-05:00' },
  { id: 'America/Chicago', label: 'Central Time (US)', offset: '-06:00' },
  { id: 'America/Denver', label: 'Mountain Time (US)', offset: '-07:00' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (US)', offset: '-08:00' },
  { id: 'Europe/London', label: 'London', offset: '+00:00' },
  { id: 'Europe/Paris', label: 'Paris', offset: '+01:00' },
  { id: 'Europe/Berlin', label: 'Berlin', offset: '+01:00' },
  { id: 'Asia/Dubai', label: 'Dubai', offset: '+04:00' },
  { id: 'Asia/Kolkata', label: 'India (IST)', offset: '+05:30' },
  { id: 'Asia/Singapore', label: 'Singapore', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: 'Tokyo', offset: '+09:00' },
  { id: 'Australia/Sydney', label: 'Sydney', offset: '+11:00' },
];

export const INDUSTRY_FEATURE_MAP: Record<string, string[]> =
  Object.fromEntries(
    SUPPORTED_INDUSTRIES.map((industry) => [industry.id, industry.modules]),
  );

export const INDUSTRY_ROLE_MAP: Record<
  string,
  Array<{ role: string; perms: string[] }>
> = {
  RESTAURANT: [
    { role: 'RESTAURANT_OWNER', perms: ['*'] },
    { role: 'OWNER', perms: ['*'] },
    { role: 'MANAGER', perms: ['*'] },
    {
      role: 'CASHIER',
      perms: [
        'pos:read',
        'pos:write',
        'payments:read',
        'payments:write',
        'orders:read',
        'orders:write',
        'tables:read',
      ],
    },
    { role: 'WAITER', perms: ['tables:read', 'orders:read', 'orders:write'] },
    {
      role: 'CHEF',
      perms: ['kitchen:read', 'kitchen:write', 'inventory:read'],
    },
  ],
  RETAIL: [
    { role: 'RESTAURANT_OWNER', perms: ['*'] },
    { role: 'OWNER', perms: ['*'] },
    { role: 'MANAGER', perms: ['*'] },
    {
      role: 'CASHIER',
      perms: ['pos:read', 'pos:write', 'payments:read', 'payments:write'],
    },
    {
      role: 'STAFF',
      perms: ['inventory:read', 'inventory:write', 'products:read'],
    },
  ],
  SALON: [
    { role: 'RESTAURANT_OWNER', perms: ['*'] },
    { role: 'OWNER', perms: ['*'] },
    { role: 'MANAGER', perms: ['*'] },
    {
      role: 'CASHIER',
      perms: ['pos:read', 'pos:write', 'payments:read', 'payments:write'],
    },
  ],
  CORPORATE: [
    { role: 'RESTAURANT_OWNER', perms: ['*'] },
    { role: 'OWNER', perms: ['*'] },
    { role: 'MANAGER', perms: ['*'] },
  ],
};

export const DEFAULT_ROLE_PERMISSIONS: Array<{
  role: string;
  perms: string[];
}> = [
  { role: 'RESTAURANT_OWNER', perms: ['*'] },
  { role: 'OWNER', perms: ['*'] },
  { role: 'MANAGER', perms: ['*'] },
];

export function slugifyBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}
