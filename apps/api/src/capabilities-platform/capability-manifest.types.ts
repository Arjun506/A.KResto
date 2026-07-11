export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | (string & {});

export type CapabilityManifestPermission = {
  action: string;
  description?: string;
};

export type CapabilityManifestRoute = {
  path: string;
  method: HttpMethod;
};

export type CapabilityManifestWidget = {
  id: string;
  widgetKey: string;
  name: string;
  category?: string;
  requiredPermission?: string;
  featureFlagKey?: string;
  route?: string;
};

export type CapabilityManifestNavigationItem = {
  id: string;
  name: string;
  href: string;
  iconKey?: string;
  badge?: number;
  category?: string;
  requiredPermission?: string;
};

export type CapabilityManifestApi = {
  version: string;
  basePath: string;
  endpoints: Array<{
    path: string;
    method: HttpMethod;
    description?: string;
  }>;
};

export type CapabilityManifestEvents = {
  topics: Array<{
    key: string;
    direction: 'EMIT' | 'CONSUME' | 'BOTH';
    description?: string;
  }>;
};

export type CapabilityManifestConfiguration = {
  schema: Record<string, unknown>;
};

export type CapabilityManifestDependency = {
  capabilityId: string;
  minVersion?: string;
};

export type CapabilityManifest = {
  capabilityId: string;
  capabilityName: string;
  version: string;
  description: string;

  permissions: {
    actions: CapabilityManifestPermission[];
  };

  routes: CapabilityManifestRoute[];

  widgets: CapabilityManifestWidget[];
  navigation: {
    items: CapabilityManifestNavigationItem[];
  };

  settings: Record<string, unknown>;

  api: CapabilityManifestApi;
  events: CapabilityManifestEvents;
  configuration: CapabilityManifestConfiguration;

  dependencies: CapabilityManifestDependency[];

  industryCompatibility?: string[];
  licenseStatus?: 'OPEN_SOURCE' | 'COMMERCIAL' | 'PROPRIETARY';
};
