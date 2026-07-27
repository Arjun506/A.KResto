import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryValuationService } from './inventory-valuation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Valuation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-valuation')
export class InventoryValuationController {
  constructor(private readonly service: InventoryValuationService) {}

  @Get(':inventoryItemId')
  @ApiOperation({
    summary:
      'Calculate financial stock valuation (FIFO, LIFO, AVCO, Standard Cost)',
  })
  async calculateItemValuation(
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.service.calculateItemValuation(inventoryItemId);
  }
}
