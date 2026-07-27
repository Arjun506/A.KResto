import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryAdjustmentsService } from './inventory-adjustments.service';
import { AdjustStockDto } from './adjust-stock.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Adjustments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-adjustments')
export class InventoryAdjustmentsController {
  constructor(private readonly service: InventoryAdjustmentsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Record stock level adjustment (Shrinkage, Damage, Write-off, Found Stock)',
  })
  async adjustStock(@Body() dto: AdjustStockDto, @Req() req: any) {
    return this.service.adjustStock(dto, req.user?.id);
  }
}
