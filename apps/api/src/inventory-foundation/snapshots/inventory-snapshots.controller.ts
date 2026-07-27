import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventorySnapshotsService } from './inventory-snapshots.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Ledger Snapshots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/snapshots')
export class InventorySnapshotsController {
  constructor(private readonly service: InventorySnapshotsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create immutable inventory ledger snapshot for audit reconciliation',
  })
  async createSnapshot(
    @Query('warehouseId') warehouseId?: string,
    @Query('inventoryItemId') inventoryItemId?: string,
  ) {
    return this.service.createSnapshot(warehouseId, inventoryItemId);
  }

  @Get()
  @ApiOperation({ summary: 'List inventory ledger snapshots' })
  async getSnapshots(@Query('warehouseId') warehouseId?: string) {
    return this.service.getSnapshots(warehouseId);
  }
}
