import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PricingVersioningService } from './pricing-versioning.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Pricing Foundation — Versioning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('price-books/:priceBookId/versions')
export class PricingVersioningController {
  constructor(private readonly service: PricingVersioningService) {}

  @Post()
  @ApiOperation({ summary: 'Create version snapshot of price book state' })
  async createVersionSnapshot(
    @Param('priceBookId') priceBookId: string,
    @Req() req: any,
  ) {
    return this.service.createVersionSnapshot(priceBookId, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get version history for a price book' })
  async getVersions(@Param('priceBookId') priceBookId: string) {
    return this.service.getVersions(priceBookId);
  }

  @Post(':versionId/rollback')
  @ApiOperation({
    summary: 'Rollback price book to a previous version snapshot',
  })
  async rollbackToVersion(
    @Param('priceBookId') priceBookId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.service.rollbackToVersion(priceBookId, versionId);
  }
}
