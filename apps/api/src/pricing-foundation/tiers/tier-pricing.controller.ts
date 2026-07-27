import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TierPricingService } from './tier-pricing.service';
import { SetTierPriceDto } from './set-tier-price.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Tier Pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing/tiers')
export class TierPricingController {
  constructor(private readonly service: TierPricingService) {}

  @Post()
  @ApiOperation({ summary: 'Set min-quantity tier price break' })
  async setTierPrice(@Body() dto: SetTierPriceDto) {
    return this.service.setTierPrice(dto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get tier price matrix for a product' })
  async getTierPrices(@Param('productId') productId: string) {
    return this.service.getTierPrices(productId);
  }
}
