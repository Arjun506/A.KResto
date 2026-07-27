import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceCalculationService } from './price-calculation.service';
import { CalculatePriceQueryDto } from './calculate-price-query.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Calculation Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing/calculate')
export class PriceCalculationController {
  constructor(private readonly service: PriceCalculationService) {}

  @Get()
  @ApiOperation({
    summary:
      'Calculate final effective price for a product, customer, business, and quantity',
  })
  async calculatePrice(@Query() query: CalculatePriceQueryDto) {
    return this.service.calculatePrice(query);
  }
}
