export type ModuleSidebarItem = {
  moduleId: string;
  id: string;
  name: string;
  href: string;
  iconKey?: string;
  badge?: number;
  requiredPermission?: string;
};

export type ModuleSidebarGroup = {
  label: string;
  items: ModuleSidebarItem[];
};

export type ModuleSidebarResponse = {
  groups: ModuleSidebarGroup[];
};

export type ModuleWidgetDef = {
  moduleId: string;
  id: string;
  widgetKey: string;
  name: string;
  category?: string;
};

export type ModuleWidgetsResponse = {
  widgets: ModuleWidgetDef[];
};

