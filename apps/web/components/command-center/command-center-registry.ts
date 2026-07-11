import { CommandResult, CommandCategory, CommandActionId } from './types';

export const STATIC_PAGES: CommandResult[] = [
  // Dashboard & Admin
  {
    id: 'page-dashboard',
    kind: 'navigate',
    category: 'Pages',
    title: 'Dashboard',
    subtitle: 'Business Overview & Statistics',
    keywords: ['home', 'main', 'summary', 'health', 'score'],
    payload: { href: '/dashboard' }
  },
  {
    id: 'page-orders',
    kind: 'navigate',
    category: 'Pages',
    title: 'Orders Management',
    subtitle: 'Track and process dine-in, takeaway, and deliveries',
    keywords: ['sales', 'orders', 'history', 'transactions', 'billing'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/orders' }
  },
  {
    id: 'page-menu',
    kind: 'navigate',
    category: 'Pages',
    title: 'Menu Management',
    subtitle: 'Configure dishes, pricing, and availability',
    keywords: ['items', 'food', 'categories', 'pricing', 'dishes', 'recipe'],
    permission: { roles: ['OWNER', 'CASHIER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/menu' }
  },
  {
    id: 'page-qr-tables',
    kind: 'navigate',
    category: 'Pages',
    title: 'Table & QR Management',
    subtitle: 'Manage tables, dining layout, and generate QR codes',
    keywords: ['dine-in', 'tables', 'qr', 'layout', 'seating'],
    permission: { roles: ['OWNER', 'WAITER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/qr-tables' }
  },
  {
    id: 'page-customers',
    kind: 'navigate',
    category: 'Pages',
    title: 'Customers Directory',
    subtitle: 'View customer history and loyalty program',
    keywords: ['clients', 'crm', 'members', 'directory', 'attendance'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/staff' } // Route used for Customers/Users management
  },
  {
    id: 'page-reservations',
    kind: 'navigate',
    category: 'Pages',
    title: 'Reservations',
    subtitle: 'Table bookings and pre-bookings',
    keywords: ['calendar', 'booking', 'scheduling', 'pre-booking'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/reservations' }
  },
  {
    id: 'page-payments',
    kind: 'navigate',
    category: 'Pages',
    title: 'Payments & Refunds',
    subtitle: 'Track transactions, card machine sync, and billing status',
    keywords: ['money', 'settlements', 'refunds', 'sales', 'billing'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/payments' }
  },
  {
    id: 'page-inventory',
    kind: 'navigate',
    category: 'Pages',
    title: 'Inventory & Stock',
    subtitle: 'Manage ingredients, raw items, stock alerts, and restock levels',
    keywords: ['supplies', 'stock', 'ingredients', 'vendors', 'purchase', 'low stock'],
    permission: { roles: ['OWNER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/inventory' }
  },
  {
    id: 'page-staff',
    kind: 'navigate',
    category: 'Pages',
    title: 'Staff Management',
    subtitle: 'Manage roles, employee schedules, and permissions',
    keywords: ['workers', 'employees', 'roles', 'attendance', 'salary'],
    permission: { roles: ['OWNER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/staff' }
  },
  {
    id: 'page-analytics',
    kind: 'navigate',
    category: 'Pages',
    title: 'Reports & Analytics',
    subtitle: 'Explore revenue, items popularity, and performance charts',
    keywords: ['stats', 'charts', 'p&l', 'metrics', 'kpi', 'sales report'],
    permission: { roles: ['OWNER', 'CASHIER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/analytics' }
  },
  {
    id: 'page-notifications',
    kind: 'navigate',
    category: 'Pages',
    title: 'Notifications Center',
    subtitle: 'Recent alerts and updates',
    keywords: ['alerts', 'messages', 'bell', 'inbox'],
    payload: { href: '/dashboard/notifications' }
  },
  {
    id: 'page-settings',
    kind: 'navigate',
    category: 'Pages',
    title: 'System Settings',
    subtitle: 'Configure billing, printer, themes, and business metadata',
    keywords: ['preferences', 'configurations', 'printers', 'logo', 'theme'],
    permission: { roles: ['OWNER', 'CHEF', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/pos' } // Route used for system settings
  },
  {
    id: 'page-billing',
    kind: 'navigate',
    category: 'Pages',
    title: 'Subscription & Plans',
    subtitle: 'Manage restaurant SaaS plan, invoice, and billings',
    keywords: ['upgrade', 'saas', 'payment', 'pro', 'starter'],
    permission: { roles: ['OWNER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/billing' }
  },
  // Waiter Specific Pages
  {
    id: 'page-waiter-tables',
    kind: 'navigate',
    category: 'Pages',
    title: 'My Tables',
    subtitle: 'Assigned tables and active orders',
    keywords: ['waiter', 'tables', 'seating', 'service'],
    permission: { roles: ['WAITER'] },
    payload: { href: '/dashboard/waiter' }
  },
  {
    id: 'page-waiter-earnings',
    kind: 'navigate',
    category: 'Pages',
    title: 'Tips & Earnings',
    subtitle: 'Track your daily tips and performance statistics',
    keywords: ['tips', 'money', 'earnings', 'commission'],
    permission: { roles: ['WAITER'] },
    payload: { href: '/dashboard/waiter' }
  },
  // Kitchen Specific Pages
  {
    id: 'page-kitchen-display',
    kind: 'navigate',
    category: 'Pages',
    title: 'Kitchen Display System (KDS)',
    subtitle: 'Monitor active food orders, preparation times, and ready alerts',
    keywords: ['chef', 'kds', 'cooking', 'items', 'ready', 'preparing'],
    permission: { roles: ['CHEF', 'CASHIER', 'OWNER', 'SUPER_ADMIN'] },
    payload: { href: '/dashboard/kitchen' }
  }
];

export const STATIC_QUICK_ACTIONS: CommandResult[] = [
  {
    id: 'action-create-product',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Product / Menu Item',
    subtitle: 'Add a new dish to the menu',
    keywords: ['new', 'add', 'dish', 'product', 'create', 'menu'],
    permission: { roles: ['OWNER', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_PRODUCT', href: '/dashboard/menu' }
  },
  {
    id: 'action-create-order',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Order (Dine-in/Takeaway)',
    subtitle: 'Launch order screen for a client',
    keywords: ['new', 'billing', 'cart', 'order', 'checkout', 'create', 'pos'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_ORDER', href: '/dashboard/pos' }
  },
  {
    id: 'action-create-customer',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Customer Profile',
    subtitle: 'Register a new customer for loyalty program',
    keywords: ['add', 'new', 'crm', 'client', 'membership', 'create'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_CUSTOMER', href: '/dashboard/staff' }
  },
  {
    id: 'action-create-employee',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Employee Account',
    subtitle: 'Add a new chef, waiter, or cashier account',
    keywords: ['hire', 'new', 'staff', 'role', 'team', 'member', 'create'],
    permission: { roles: ['OWNER', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_EMPLOYEE', href: '/dashboard/staff' }
  },
  {
    id: 'action-generate-invoice',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Generate Invoice / Receipt',
    subtitle: 'Print or export payment receipt',
    keywords: ['bill', 'receipt', 'print', 'pdf', 'invoice'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { actionId: 'GENERATE_INVOICE', href: '/dashboard/payments' }
  },
  {
    id: 'action-generate-qr',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Generate Table QR Codes',
    subtitle: 'Export QR code PDFs for table ordering',
    keywords: ['qr', 'dine-in', 'table', 'pdf', 'generate'],
    permission: { roles: ['OWNER', 'SUPER_ADMIN'] },
    payload: { actionId: 'GENERATE_QR', href: '/dashboard/qr-tables' }
  },
  {
    id: 'action-open-pos',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Open Point-of-Sale (POS)',
    subtitle: 'Go to billing terminal',
    keywords: ['billing', 'counter', 'checkout', 'pos', 'cashier', 'terminal'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { actionId: 'OPEN_POS', href: '/dashboard/pos' }
  },
  {
    id: 'action-open-analytics',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Open Sales Analytics',
    subtitle: 'Review revenue stats',
    keywords: ['charts', 'revenue', 'analytics', 'statistics'],
    permission: { roles: ['OWNER', 'SUPER_ADMIN'] },
    payload: { actionId: 'OPEN_ANALYTICS', href: '/dashboard/analytics' }
  },
  {
    id: 'action-open-restock',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Restock Request',
    subtitle: 'Place ingredient purchase order',
    keywords: ['buy', 'restock', 'ingredients', 'supplier', 'inventory'],
    permission: { roles: ['OWNER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { actionId: 'OPEN_RESTOCK', href: '/dashboard/inventory' }
  },
  {
    id: 'action-open-help',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Open Help Center & FAQs',
    subtitle: 'Search guides and keyboard shortcuts documentation',
    keywords: ['help', 'faq', 'support', 'guidance', 'center', 'shortcuts'],
    payload: { actionId: 'OPEN_HELP' }
  },
  {
    id: 'action-open-ai',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Open Workspace AI Assistant',
    subtitle: 'Ask AI chatbot for operation drafts & calculations',
    keywords: ['ai', 'gpt', 'bot', 'gemini', 'chat', 'dock', 'copilot'],
    payload: { actionId: 'OPEN_AI' }
  },
  {
    id: 'action-trigger-tour',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Restart Interactive Product Tour',
    subtitle: 'Re-run walkthrough of dashboard layout highlights',
    keywords: ['tour', 'product', 'walkthrough', 'guided', 'tutorial', 'restart'],
    payload: { actionId: 'TRIGGER_TOUR' }
  },
  {
    id: 'action-toggle-theme',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Toggle Light / Dark Mode',
    subtitle: 'Switch between light and dark visual themes',
    keywords: ['theme', 'dark', 'light', 'black', 'white', 'night'],
    payload: { actionId: 'TOGGLE_DARK_MODE' }
  },
  {
    id: 'action-create-invoice',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Invoice',
    subtitle: 'Issue a new customer invoice',
    keywords: ['new', 'add', 'billing', 'invoice', 'create'],
    permission: { roles: ['OWNER', 'CASHIER', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_INVOICE', href: '/dashboard/payments' }
  },
  {
    id: 'action-create-purchase',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Create Purchase / Restock Order',
    subtitle: 'Draft a new supply purchase order',
    keywords: ['new', 'add', 'purchase', 'buy', 'restock', 'create'],
    permission: { roles: ['OWNER', 'CHEF', 'SUPER_ADMIN'] },
    payload: { actionId: 'CREATE_PURCHASE', href: '/dashboard/inventory' }
  },
  {
    id: 'action-open-settings',
    kind: 'action',
    category: 'Quick Actions',
    title: 'Open Settings',
    subtitle: 'Configure printers, themes, and layouts',
    keywords: ['settings', 'preferences', 'configuration', 'theme'],
    payload: { actionId: 'OPEN_SETTINGS', href: '/dashboard/pos' }
  }
];

export const STATIC_PRODUCTS: CommandResult[] = [
  { id: 'prod-margherita', kind: 'placeholder', category: 'Products', title: 'Margherita Pizza', subtitle: 'Classic cheese & tomato pizza | ₹280', keywords: ['pizza', 'italian', 'cheese', 'tomato', 'main'] },
  { id: 'prod-paneer', kind: 'placeholder', category: 'Products', title: 'Paneer Butter Masala', subtitle: 'Cottage cheese in butter gravy | ₹310', keywords: ['paneer', 'cottage cheese', 'curry', 'indian'] },
  { id: 'prod-garlic', kind: 'placeholder', category: 'Products', title: 'Garlic Bread', subtitle: 'Bread baked with garlic butter & herbs | ₹140', keywords: ['bread', 'starter', 'garlic'] },
  { id: 'prod-lassi', kind: 'placeholder', category: 'Products', title: 'Mango Lassi', subtitle: 'Creamy yogurt drink with mango pulp | ₹95', keywords: ['drink', 'mango', 'beverage', 'lassi'] },
  { id: 'prod-biryani', kind: 'placeholder', category: 'Products', title: 'Vegetable Biryani', subtitle: 'Basmati rice cooked with mixed vegetables | ₹260', keywords: ['rice', 'biryani', 'main', 'indian'] },
  { id: 'prod-brownie', kind: 'placeholder', category: 'Products', title: 'Chocolate Brownie', subtitle: 'Hot chocolate brownie with walnuts | ₹160', keywords: ['sweet', 'dessert', 'chocolate', 'brownie'] },
  { id: 'prod-naan', kind: 'placeholder', category: 'Products', title: 'Butter Naan', subtitle: 'Soft leavened Indian flatbread with butter | ₹55', keywords: ['bread', 'naan', 'indian'] },
  { id: 'prod-tikka', kind: 'placeholder', category: 'Products', title: 'Chicken Tikka Masala', subtitle: 'Roasted chicken chunks in spiced gravy | ₹360', keywords: ['chicken', 'non-veg', 'curry', 'indian'] },
  { id: 'prod-mojito', kind: 'placeholder', category: 'Products', title: 'Virgin Mojito', subtitle: 'Mint, lime, sugar & soda beverage | ₹120', keywords: ['drink', 'mojito', 'lime', 'mint', 'beverage'] },
  { id: 'prod-fries', kind: 'placeholder', category: 'Products', title: 'French Fries', subtitle: 'Crispy salted potato fries | ₹110', keywords: ['potato', 'starter', 'fries', 'chips'] }
];

export const STATIC_CUSTOMERS: CommandResult[] = [
  { id: 'cust-arjun', kind: 'placeholder', category: 'Customers', title: 'Arjun Sharma', subtitle: 'arjun.sharma@gmail.com | Gold Member', keywords: ['arjun', 'sharma', 'gold', 'loyalty'] },
  { id: 'cust-priya', kind: 'placeholder', category: 'Customers', title: 'Priya Patel', subtitle: 'priya.patel@yahoo.com | Silver Member', keywords: ['priya', 'patel', 'silver', 'loyalty'] },
  { id: 'cust-rahul', kind: 'placeholder', category: 'Customers', title: 'Rahul Verma', subtitle: 'rahul.verma@outlook.com | Regular Client', keywords: ['rahul', 'verma', 'regular'] },
  { id: 'cust-aisha', kind: 'placeholder', category: 'Customers', title: 'Aisha Khan', subtitle: 'aisha.khan@hotmail.com | VIP Member', keywords: ['aisha', 'khan', 'vip', 'loyalty'] },
  { id: 'cust-suresh', kind: 'placeholder', category: 'Customers', title: 'Suresh Kumar', subtitle: 'suresh.kumar@gmail.com | Gold Member', keywords: ['suresh', 'kumar', 'gold'] },
  { id: 'cust-meera', kind: 'placeholder', category: 'Customers', title: 'Meera Nair', subtitle: 'meera.nair@gmail.com | Regular Client', keywords: ['meera', 'nair'] }
];

export const STATIC_ORDERS: CommandResult[] = [
  { id: 'ord-1265', kind: 'placeholder', category: 'Orders', title: 'Order #ORD1265', subtitle: 'Table 5 | 3 items | ₹820 | Pending preparation', keywords: ['1265', 'table 5', 'pending', 'active'] },
  { id: 'ord-1254', kind: 'placeholder', category: 'Orders', title: 'Order #ORD1254', subtitle: 'Takeaway | 2 items | ₹380 | Paid & Completed', keywords: ['1254', 'takeaway', 'completed', 'paid'] },
  { id: 'ord-1234', kind: 'placeholder', category: 'Orders', title: 'Order #ORD1234', subtitle: 'Delivery | 5 items | ₹1,240 | Cancelled', keywords: ['1234', 'delivery', 'cancelled'] },
  { id: 'ord-1289', kind: 'placeholder', category: 'Orders', title: 'Order #ORD1289', subtitle: 'Table 12 | 4 items | ₹1,150 | Preparing in kitchen', keywords: ['1289', 'table 12', 'preparing', 'kitchen'] },
  { id: 'ord-1290', kind: 'placeholder', category: 'Orders', title: 'Order #ORD1290', subtitle: 'Table 2 | 1 item | ₹180 | Ready to serve', keywords: ['1290', 'table 2', 'ready', 'completed'] }
];

export const STATIC_EMPLOYEES: CommandResult[] = [
  { id: 'emp-ramesh', kind: 'placeholder', category: 'Employees', title: 'Chef Ramesh Kumar', subtitle: 'Head Chef | kitchen-dept', keywords: ['ramesh', 'kumar', 'chef', 'kitchen'] },
  { id: 'emp-kiran', kind: 'placeholder', category: 'Employees', title: 'Kiran Shah', subtitle: 'Billing Cashier | sales-dept', keywords: ['kiran', 'shah', 'cashier', 'billing'] },
  { id: 'emp-raju', kind: 'placeholder', category: 'Employees', title: 'Raju Prasad', subtitle: 'Service Waiter | service-dept', keywords: ['raju', 'prasad', 'waiter', 'service'] },
  { id: 'emp-vikram', kind: 'placeholder', category: 'Employees', title: 'Vikram Rathore', subtitle: 'Restaurant Owner | admin-dept', keywords: ['vikram', 'rathore', 'owner', 'admin'] },
  { id: 'emp-suman', kind: 'placeholder', category: 'Employees', title: 'Chef Suman Sen', subtitle: 'Sous Chef | kitchen-dept', keywords: ['suman', 'sen', 'chef', 'kitchen'] },
  { id: 'emp-amit', kind: 'placeholder', category: 'Employees', title: 'Amit Mishra', subtitle: 'Service Waiter | service-dept', keywords: ['amit', 'mishra', 'waiter'] }
];

export const STATIC_REPORTS: CommandResult[] = [
  { id: 'rep-sales-summary', kind: 'placeholder', category: 'Reports', title: 'Daily Sales Summary Report', subtitle: 'PDF | Aggregated revenues, bills, payment modes', keywords: ['sales', 'revenue', 'earnings', 'daily', 'summary', 'report'] },
  { id: 'rep-inventory-usage', kind: 'placeholder', category: 'Reports', title: 'Inventory Usage & Spoilage', subtitle: 'PDF | Ingredients consumption list', keywords: ['inventory', 'usage', 'spoilage', 'stock', 'report'] },
  { id: 'rep-profit-loss', kind: 'placeholder', category: 'Reports', title: 'Profit & Loss Statement (P&L)', subtitle: 'Excel | Business health overview', keywords: ['profit', 'loss', 'p&l', 'finance', 'balance', 'report'] },
  { id: 'rep-attendance', kind: 'placeholder', category: 'Reports', title: 'Staff Attendance & Hours Report', subtitle: 'PDF | Timesheets audit logs', keywords: ['staff', 'attendance', 'hours', 'timesheet', 'salary', 'report'] },
  { id: 'rep-feedback', kind: 'placeholder', category: 'Reports', title: 'Customer Feedback Analysis', subtitle: 'PDF | Reviews & ratings analysis', keywords: ['customer', 'feedback', 'reviews', 'ratings', 'report'] }
];

export const STATIC_MODULES: CommandResult[] = [
  {
    id: 'mod-pos',
    kind: 'navigate',
    category: 'Modules',
    title: 'POS Module',
    subtitle: 'Core module for billing, order taking, table layout management',
    keywords: ['pos', 'billing', 'core', 'module'],
    payload: { href: '/dashboard/pos' }
  },
  {
    id: 'mod-inventory',
    kind: 'navigate',
    category: 'Modules',
    title: 'Inventory Module',
    subtitle: 'Track restock requests, ingredient prices, low stock alerts',
    keywords: ['inventory', 'ingredients', 'module'],
    payload: { href: '/dashboard/inventory' }
  },
  {
    id: 'mod-reservations',
    kind: 'navigate',
    category: 'Modules',
    title: 'Reservations Module',
    subtitle: 'Advance table booking and pre-orders booking systems',
    keywords: ['reservations', 'bookings', 'pre-bookings', 'module'],
    payload: { href: '/dashboard/reservations' }
  },
  {
    id: 'mod-analytics',
    kind: 'navigate',
    category: 'Modules',
    title: 'Analytics Engine Module',
    subtitle: 'View dashboards, daily analytics reports, and visual charts',
    keywords: ['analytics', 'charts', 'graphs', 'reporting', 'module'],
    payload: { href: '/dashboard/analytics' }
  }
];

export const STATIC_INVOICES: CommandResult[] = [
  { id: 'inv-2026-001', kind: 'placeholder', category: 'Invoices', title: 'Invoice #INV-2026-001', subtitle: 'Sarah Jenkins | ₹820 | Settle Paid', keywords: ['jenkins', 'inv-2026-001', 'paid', 'invoice'] },
  { id: 'inv-2026-002', kind: 'placeholder', category: 'Invoices', title: 'Invoice #INV-2026-002', subtitle: 'Rahul Malhotra | ₹560 | Settle Paid', keywords: ['malhotra', 'inv-2026-002', 'paid', 'invoice'] },
  { id: 'inv-2026-003', kind: 'placeholder', category: 'Invoices', title: 'Invoice #INV-2026-003', subtitle: 'Amit Kumar | ₹320 | Settle Paid', keywords: ['kumar', 'inv-2026-003', 'paid', 'invoice'] }
];

export const STATIC_BUSINESSES: CommandResult[] = [
  { id: 'bus-akresto', kind: 'placeholder', category: 'Businesses', title: 'AKresto Restaurant (Main)', subtitle: 'Slug: akresto | Active Tenant', keywords: ['akresto', 'restaurant', 'tenant', 'active'] },
  { id: 'bus-akretail', kind: 'placeholder', category: 'Businesses', title: 'AKretail Mall (Branch)', subtitle: 'Slug: akretail | Sub Tenant', keywords: ['akretail', 'retail', 'tenant'] }
];

export function getRegistryItems(role: string): CommandResult[] {
  // Combine all items
  const allItems = [
    ...STATIC_PAGES,
    ...STATIC_QUICK_ACTIONS,
    ...STATIC_PRODUCTS,
    ...STATIC_CUSTOMERS,
    ...STATIC_ORDERS,
    ...STATIC_EMPLOYEES,
    ...STATIC_REPORTS,
    ...STATIC_MODULES,
    ...STATIC_INVOICES,
    ...STATIC_BUSINESSES
  ];

  // Filter based on user role permission.
  // If permission is undefined, it's open to everyone.
  return allItems.filter(item => {
    if (!item.permission || !item.permission.roles) return true;
    return item.permission.roles.includes(role);
  });
}
