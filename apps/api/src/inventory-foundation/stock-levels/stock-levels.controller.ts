import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockLevelsService } from './stock-levels.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Stock Levels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-levels')
export class StockLevelsController {
  constructor(private readonly service: StockLevelsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get real-time stock levels (On-Hand, Available, Reserved, In-Transit, Damaged)',
  })
  async getStockLevels(
    @Query('inventoryItemId') inventoryItemId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.service.getStockLevels(inventoryItemId, warehouseId);
  }
}
