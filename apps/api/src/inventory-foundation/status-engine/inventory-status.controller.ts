import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryStatusService } from './inventory-status.service';
import { UpdateStockStatusDto } from './update-stock-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PublicTenant } from '../../tenant/public-tenant.decorator';

@ApiTags('Inventory Foundation — Status Engine')
@Controller('inventory-status')
export class InventoryStatusController {
  constructor(private readonly service: InventoryStatusService) {}

  @Patch('items/:inventoryItemId/warehouses/:warehouseId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Update stock level status (Available, Quarantined, Damaged, On Hold, Blocked)',
  })
  async updateStockLevelStatus(
    @Param('inventoryItemId') inventoryItemId: string,
    @Param('warehouseId') warehouseId: string,
    @Body() dto: UpdateStockStatusDto,
  ) {
    return this.service.updateStockLevelStatus(
      inventoryItemId,
      warehouseId,
      dto,
    );
  }

  @Get('definitions')
  @PublicTenant()
  @ApiOperation({ summary: 'Get inventory status state definitions' })
  async getStockStatusDefinitions() {
    return this.service.getStockStatusDefinitions();
  }
}
