import { CapabilityManifest } from '../capabilities-platform/capability-manifest.types';

// NOTE: Foundation-only wiring. Later sprints can replace/extend this.
export const masterDataCapabilityManifest: CapabilityManifest = {
  capabilityId: 'capability-master-data',
  capabilityName: 'Master Data Capability',
  version: '1.0.0',
  description:
    'Centralized multi-tenant master data foundation for all business domains.',
  permissions: {
    actions: [
      { action: 'master-data:read', description: 'Read master data' },
      { action: 'master-data:create', description: 'Create master data' },
      { action: 'master-data:update', description: 'Update master data' },
      {
        action: 'master-data:delete',
        description: 'Delete (soft) master data',
      },
    ],
  },
  routes: [
    { path: '/master-data/:resource', method: 'GET' },
    { path: '/master-data/:resource/:id', method: 'GET' },
    { path: '/master-data/:resource', method: 'POST' },
    { path: '/master-data/:resource/:id', method: 'PATCH' },
    { path: '/master-data/:resource/:id', method: 'DELETE' },
  ],
  widgets: [
    {
      id: 'master-data-widget',
      widgetKey: 'master-data-widget',
      name: 'Master Data',
      category: 'Foundation',
      requiredPermission: 'master-data:read',
      route: '/dashboard/master-data',
    },
  ],
  navigation: {
    items: [
      {
        id: 'master-data',
        name: 'Master Data',
        href: '/dashboard/master-data',
        iconKey: 'Database',
        category: 'Foundation',
        requiredPermission: 'master-data:read',
      },
    ],
  },
  settings: {},
  api: {
    version: '1',
    basePath: '/api/v1/master-data',
    endpoints: [
      { path: '/:resource', method: 'GET', description: 'List master data' },
    ],
  },
  events: { topics: [] },
  configuration: { schema: {} },
  dependencies: [],
  industryCompatibility: ['*'],
  licenseStatus: 'OPEN_SOURCE',
};
