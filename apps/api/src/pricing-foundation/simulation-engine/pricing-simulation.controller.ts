import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingSimulationService } from './pricing-simulation.service';
import { SimulatePricingQueryDto } from './simulate-pricing-query.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Simulation Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing/simulate')
export class PricingSimulationController {
  constructor(private readonly service: PricingSimulationService) {}

  @Post()
  @ApiOperation({
    summary:
      'Simulate price calculation dry-run, difference analysis, and rule preview',
  })
  async simulatePricing(@Body() dto: SimulatePricingQueryDto) {
    return this.service.simulatePricing(dto);
  }
}
