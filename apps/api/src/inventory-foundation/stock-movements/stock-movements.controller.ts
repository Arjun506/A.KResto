import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockMovementsService } from './stock-movements.service';
import { RecordMovementDto } from './record-movement.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Stock Movements Ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly service: StockMovementsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Record stock ledger movement (Receipt, Issue, Transfer, Adjustment, Scrap)',
  })
  async recordMovement(@Body() dto: RecordMovementDto, @Req() req: any) {
    return this.service.recordMovement(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Query immutable stock ledger transaction log' })
  async getMovements(
    @Query('inventoryItemId') inventoryItemId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.service.getMovements(inventoryItemId, warehouseId);
  }
}
