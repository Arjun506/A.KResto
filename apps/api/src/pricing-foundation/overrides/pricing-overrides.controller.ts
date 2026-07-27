import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingOverridesService } from './pricing-overrides.service';
import { SetCustomerPriceDto, SetBusinessPriceDto } from './set-override.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Overrides')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing/overrides')
export class PricingOverridesController {
  constructor(private readonly service: PricingOverridesService) {}

  @Post('customer')
  @ApiOperation({ summary: 'Set VIP / Customer-specific price override' })
  async setCustomerPrice(@Body() dto: SetCustomerPriceDto) {
    return this.service.setCustomerPrice(dto);
  }

  @Post('business')
  @ApiOperation({ summary: 'Set B2B Corporate contract price override' })
  async setBusinessPrice(@Body() dto: SetBusinessPriceDto) {
    return this.service.setBusinessPrice(dto);
  }
}
