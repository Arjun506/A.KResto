import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpiryManagementService } from './expiry-management.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Expiry Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-expiry')
export class ExpiryManagementController {
  constructor(private readonly service: ExpiryManagementService) {}

  @Get('expiring-soon')
  @ApiOperation({
    summary: 'Get stock batches expiring within specified day threshold',
  })
  async getExpiringBatches(@Query('days') days?: number) {
    return this.service.getExpiringBatches(days ? Number(days) : 30);
  }
}
