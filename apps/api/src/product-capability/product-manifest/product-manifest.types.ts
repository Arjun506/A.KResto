export type ProductVisibility = 'PUBLIC' | 'DRAFT' | 'HIDDEN';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type ProductKind =
  | 'SIMPLE'
  | 'VARIABLE'
  | 'SERVICE'
  | 'DIGITAL'
  | 'COMBO'
  | 'RAW_MATERIAL'
  | 'FINISHED_GOOD'
  | 'BUNDLE'
  | 'SUBSCRIPTION'
  | 'RENTAL';

export type ProductSeo = {
  title?: string;
  description?: string;
  slug?: string;
};

export type ProductPricing = {
  basePrice?: number; // stored as Decimal in DB, exposed as number
  currency?: string;
  taxRate?: number;
};

export type ProductAttribute = {
  key: string;
  values: string[];
};

export type ProductVariant = {
  sku?: string;
  barcode?: string;
  priceDelta?: number;
  attributes?: Record<string, string>;
  isActive?: boolean;
};

export type ProductMedia = {
  images?: string[];
  videos?: string[];
};

export type ProductManifest = {
  capabilityId: string;
  capabilityName: string;
  version: string;
  description: string;

  // UI / API shape hints
  supportedProductKinds: ProductKind[];
  fieldGroups: {
    required: string[];
    optional: string[];
  };
};
