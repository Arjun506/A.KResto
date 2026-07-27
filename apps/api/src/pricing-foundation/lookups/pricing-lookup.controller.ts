import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingLookupService } from './pricing-lookup.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Pricing Foundation — Reference Lookups')
@PublicTenant()
@Controller('pricing-lookups')
export class PricingLookupController {
  constructor(private readonly service: PricingLookupService) {}

  @Get('tax-strategies')
  @ApiOperation({ summary: 'Get tax calculation strategies' })
  getTaxStrategies() {
    return this.service.getTaxStrategies();
  }

  @Get('price-rule-types')
  @ApiOperation({ summary: 'Get price rule calculation types' })
  getPriceRuleTypes() {
    return this.service.getPriceRuleTypes();
  }

  @Get('workflow-statuses')
  @ApiOperation({ summary: 'Get approval workflow states' })
  getWorkflowStatuses() {
    return this.service.getWorkflowStatuses();
  }

  @Get('coupon-types')
  @ApiOperation({ summary: 'Get coupon and voucher classifications' })
  getCouponTypes() {
    return this.service.getCouponTypes();
  }
}
