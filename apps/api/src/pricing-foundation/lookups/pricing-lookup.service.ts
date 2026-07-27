import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingLookupService {
  getTaxStrategies() {
    return [
      { code: 'INCLUSIVE', label: 'Tax Inclusive Pricing' },
      { code: 'EXCLUSIVE', label: 'Tax Exclusive Pricing' },
      { code: 'EXEMPT', label: 'Tax Exempt' },
      { code: 'ZERO_RATED', label: 'Zero Rated Tax' },
    ];
  }

  getPriceRuleTypes() {
    return [
      { code: 'PERCENTAGE_DISCOUNT', label: 'Percentage Off Discount' },
      { code: 'FIXED_DISCOUNT', label: 'Fixed Amount Off' },
      { code: 'MARKUP', label: 'Cost Plus Markup' },
      { code: 'FIXED_PRICE', label: 'Fixed Override Price' },
      { code: 'BUY_X_GET_Y', label: 'Buy X Get Y Free Deal' },
    ];
  }

  getWorkflowStatuses() {
    return [
      { code: 'DRAFT', label: 'Draft Mode' },
      { code: 'SUBMITTED', label: 'Submitted for Approval' },
      { code: 'APPROVED', label: 'Approved by Pricing Manager' },
      { code: 'REJECTED', label: 'Rejected' },
      { code: 'PUBLISHED', label: 'Published & Live' },
    ];
  }

  getCouponTypes() {
    return [
      { code: 'PERCENTAGE', label: 'Percentage Coupon' },
      { code: 'FIXED_AMOUNT', label: 'Fixed Amount Voucher' },
      { code: 'GIFT_CARD', label: 'Stored Value Gift Card' },
      { code: 'VOUCHER', label: 'Single-use Promo Code' },
    ];
  }
}
