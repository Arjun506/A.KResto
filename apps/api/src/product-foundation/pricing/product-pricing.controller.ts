import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductPricingService } from './product-pricing.service';
import { SetProductPriceDto } from './set-price.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Product Foundation — Pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products/:productId/prices')
export class ProductPricingController {
  constructor(private readonly service: ProductPricingService) {}

  @Post()
  @ApiOperation({
    summary:
      'Set product price (Base, MSRP, Cost, Sale, Customer/Business/Channel overrides)',
  })
  async setPrice(
    @Param('productId') productId: string,
    @Body() dto: SetProductPriceDto,
  ) {
    return this.service.setPrice(productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prices and overrides for a product' })
  async getPrices(@Param('productId') productId: string) {
    return this.service.getPrices(productId);
  }
}
