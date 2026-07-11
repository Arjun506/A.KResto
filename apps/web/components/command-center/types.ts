export type CommandCategory =
  | 'Quick Actions'
  | 'Modules'
  | 'Pages'
  | 'Products'
  | 'Orders'
  | 'Invoices'
  | 'Customers'
  | 'Employees'
  | 'Reports'
  | 'Businesses'
  | 'Unknown';

export type CommandActionId =
  | 'CREATE_PRODUCT'
  | 'CREATE_ORDER'
  | 'CREATE_CUSTOMER'
  | 'CREATE_EMPLOYEE'
  | 'CREATE_INVOICE'
  | 'CREATE_PURCHASE'
  | 'GENERATE_INVOICE'
  | 'GENERATE_QR'
  | 'OPEN_POS'
  | 'OPEN_ANALYTICS'
  | 'OPEN_RESTOCK'
  | 'OPEN_SETTINGS'
  | 'OPEN_HELP'
  | 'OPEN_AI'
  | 'TRIGGER_TOUR'
  | 'TOGGLE_DARK_MODE';

export type CommandResultKind = 'action' | 'navigate' | 'placeholder';

export type CommandResult = {
  id: string;
  kind: CommandResultKind;
  category: CommandCategory;
  title: string;
  subtitle?: string;
  keywords?: string[];
  permission?: {
    roles?: string[]; // role names in backend enum-ish form
    requiredPermission?: string; // future: backend permission
  };
  payload?: {
    actionId?: CommandActionId;
    href?: string;
  };
};

