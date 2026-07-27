import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductLookupService {
  getIdentityTypes() {
    return [
      { code: 'PHYSICAL', label: 'Physical Goods' },
      { code: 'DIGITAL', label: 'Digital Download / File' },
      { code: 'SERVICE', label: 'Service / Labor' },
      { code: 'SUBSCRIPTION', label: 'Recurring Subscription' },
      { code: 'MEMBERSHIP', label: 'Membership Plan' },
      { code: 'RENTAL', label: 'Rental Asset / Time-based' },
      { code: 'COMPOSITE_BUNDLE', label: 'Composite Bundle / Kit Assembly' },
    ];
  }

  getLifecycleStages() {
    return [
      { code: 'IDEATION', label: 'Ideation / Concept' },
      { code: 'DEVELOPMENT', label: 'In Development' },
      { code: 'ACTIVE', label: 'Active Commercial Product' },
      { code: 'DISCONTINUED', label: 'Discontinued' },
      { code: 'END_OF_LIFE', label: 'End of Life (EOL)' },
    ];
  }

  getPublishingStatuses() {
    return [
      { code: 'DRAFT', label: 'Draft Mode' },
      { code: 'REVIEW', label: 'Pending Compliance Review' },
      { code: 'APPROVED', label: 'Approved for Catalog' },
      { code: 'PUBLISHED', label: 'Published & Visible' },
      { code: 'ARCHIVED', label: 'Archived / Hidden' },
    ];
  }

  getRelationshipTypes() {
    return [
      { code: 'RELATED', label: 'Related Product' },
      { code: 'SIMILAR', label: 'Similar Product Alternative' },
      { code: 'CROSS_SELL', label: 'Cross-Sell Item' },
      { code: 'UP_SELL', label: 'Up-Sell Premium Upgrade' },
      { code: 'ACCESSORY', label: 'Compatible Accessory' },
      { code: 'REPLACEMENT', label: 'Replacement Part / Model' },
    ];
  }

  getPriceTypes() {
    return [
      { code: 'BASE', label: 'Base Standard Price' },
      { code: 'MSRP', label: 'Manufacturer Suggested Retail Price' },
      { code: 'COST', label: 'Vendor Cost Price' },
      { code: 'SALE', label: 'Promotional / Sale Price' },
      { code: 'TIERED', label: 'Volume Tiered Discount Price' },
      { code: 'SPECIAL', label: 'Special / Override Price' },
    ];
  }
}
