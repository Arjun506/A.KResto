import { Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryVersioningService } from './inventory-versioning.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Versioning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/versions')
export class InventoryVersioningController {
  constructor(private readonly service: InventoryVersioningService) {}

  @Post()
  @ApiOperation({
    summary: 'Create version snapshot of inventory configuration',
  })
  async createVersion(
    @Query('inventoryItemId') inventoryItemId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Req() req?: any,
  ) {
    return this.service.createVersion(
      inventoryItemId,
      warehouseId,
      req?.user?.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'List version history for inventory item or warehouse',
  })
  async getVersions(
    @Query('inventoryItemId') inventoryItemId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.service.getVersions(inventoryItemId, warehouseId);
  }
}
