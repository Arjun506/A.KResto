import { ProductManifest } from './product-manifest.types';

export const productManifest: ProductManifest = {
  capabilityId: 'capability-product',
  capabilityName: 'Product Capability',
  version: '1.0.0',
  description:
    'Universal Business OS product catalog model for goods, services, digital items, bundles, subscriptions, and rentals.',
  supportedProductKinds: [
    'SIMPLE',
    'VARIABLE',
    'SERVICE',
    'DIGITAL',
    'COMBO',
    'RAW_MATERIAL',
    'FINISHED_GOOD',
    'BUNDLE',
    'SUBSCRIPTION',
    'RENTAL',
  ],
  fieldGroups: {
    required: [
      'name',
      'sku',
      'barcode',
      'qrCode',
      'category',
      'brand',
      'unit',
      'tax',
      'pricing',
      'status',
      'visibility',
    ],
    optional: [
      'images',
      'videos',
      'description',
      'attributes',
      'variants',
      'tags',
      'seo',
      'supplier',
      'manufacturer',
    ],
  },
};
