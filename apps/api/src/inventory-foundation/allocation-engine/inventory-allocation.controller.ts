import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryAllocationService } from './inventory-allocation.service';
import { AllocateStockDto } from './create-allocation.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Allocation Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/allocate')
export class InventoryAllocationController {
  constructor(private readonly service: InventoryAllocationService) {}

  @Post()
  @ApiOperation({ summary: 'Allocate available stock based on priority rules' })
  async allocateStock(@Body() dto: AllocateStockDto) {
    return this.service.allocateStock(dto);
  }
}
