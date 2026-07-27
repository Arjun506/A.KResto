import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingAuditSnapshotService } from './pricing-audit-snapshot.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Audit Snapshots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pricing-audit-snapshots')
export class PricingAuditSnapshotController {
  constructor(private readonly service: PricingAuditSnapshotService) {}

  @Get()
  @ApiOperation({
    summary: 'List immutable before/after pricing audit snapshots',
  })
  async getSnapshots(
    @Query('priceBookId') priceBookId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.service.getSnapshots(priceBookId, productId);
  }
}
