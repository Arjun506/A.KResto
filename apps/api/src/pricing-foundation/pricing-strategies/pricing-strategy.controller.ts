import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingStrategyService } from './pricing-strategy.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Pricing Foundation — Strategies')
@PublicTenant()
@Controller('pricing-strategies')
export class PricingStrategyController {
  constructor(private readonly service: PricingStrategyService) {}

  @Get()
  @ApiOperation({ summary: 'Get available pricing strategy classifications' })
  getAvailableStrategies() {
    return this.service.getAvailableStrategies();
  }
}
