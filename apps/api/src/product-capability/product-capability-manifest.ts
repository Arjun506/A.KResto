import { CapabilityManifest } from '../capabilities-platform/capability-manifest.types';

export const productCapabilityManifest: CapabilityManifest = {
  capabilityId: 'capability-product',
  capabilityName: 'Product Capability',
  version: '1.0.0',
  description:
    'Universal Business OS product catalog model for goods, services, digital items, bundles, subscriptions, and rentals. No inventory/orders logic.',
  permissions: {
    actions: [
      { action: 'product:read', description: 'Read products' },
      { action: 'product:create', description: 'Create products' },
      { action: 'product:update', description: 'Update products' },
      { action: 'product:publish', description: 'Publish products' },
    ],
  },
  routes: [
    { path: '/product-capability/products', method: 'GET' },
    { path: '/product-capability/products/:id', method: 'GET' },
    { path: '/product-capability/products', method: 'POST' },
    { path: '/product-capability/products/:id', method: 'PUT' },
    { path: '/product-capability/products/:id/publish', method: 'POST' },
  ],
  widgets: [
    {
      id: 'product-catalog-widget',
      widgetKey: 'product-catalog-widget',
      name: 'Product Catalog',
      category: 'Products',
      requiredPermission: 'product:read',
      route: '/dashboard/products',
    },
  ],
  navigation: {
    items: [
      {
        id: 'product-catalog',
        name: 'Products',
        href: '/dashboard/products',
        iconKey: 'Package',
        category: 'Catalog',
        requiredPermission: 'product:read',
      },
    ],
  },
  settings: {},
  api: {
    version: '1',
    basePath: '/product-capability',
    endpoints: [
      {
        path: '/manifest',
        method: 'GET',
        description: 'Get product capability manifest',
      },
      { path: '/products', method: 'GET', description: 'List products' },
      {
        path: '/products/:id',
        method: 'GET',
        description: 'Get product by id',
      },
    ],
  },
  events: {
    topics: [
      {
        key: 'product.created',
        direction: 'EMIT',
        description: 'Emitted when product is created',
      },
      {
        key: 'product.updated',
        direction: 'EMIT',
        description: 'Emitted when product is updated',
      },
      {
        key: 'product.published',
        direction: 'EMIT',
        description: 'Emitted when product is published',
      },
    ],
  },
  configuration: {
    schema: {},
  },
  dependencies: [],
  industryCompatibility: ['*'],
  licenseStatus: 'OPEN_SOURCE',
};
