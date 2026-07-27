import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingConflictResolutionService {
  getPrecedenceHierarchy() {
    return [
      {
        level: 1,
        type: 'CUSTOMER_PRICING',
        priorityScore: 100,
        description: 'Individual customer specific contract price',
      },
      {
        level: 2,
        type: 'BUSINESS_PRICING',
        priorityScore: 90,
        description: 'B2B corporate contract price',
      },
      {
        level: 3,
        type: 'PROMOTIONS',
        priorityScore: 80,
        description: 'Active promotional coupon or flash sale',
      },
      {
        level: 4,
        type: 'REGIONAL_PRICING',
        priorityScore: 70,
        description: 'Geographic market rate override',
      },
      {
        level: 5,
        type: 'CHANNEL_PRICING',
        priorityScore: 60,
        description: 'Channel specific rate (POS vs Web)',
      },
      {
        level: 6,
        type: 'TIER_PRICING',
        priorityScore: 50,
        description: 'Volume quantity break tier price',
      },
      {
        level: 7,
        type: 'BASE_PRICING',
        priorityScore: 10,
        description: 'Standard base list price',
      },
    ];
  }
}
