import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PricingConflictResolutionService } from './pricing-conflict-resolution.service';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Pricing Foundation — Conflict Resolution')
@PublicTenant()
@Controller('pricing-conflict-resolution')
export class PricingConflictResolutionController {
  constructor(private readonly service: PricingConflictResolutionService) {}

  @Get('precedence')
  @ApiOperation({
    summary: 'Get rule conflict resolution precedence hierarchy',
  })
  getPrecedenceHierarchy() {
    return this.service.getPrecedenceHierarchy();
  }
}
