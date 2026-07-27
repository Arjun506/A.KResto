import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BatchManagementService } from './batch-management.service';
import { CreateBatchDto } from './create-batch.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Batch Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory-batches')
export class BatchManagementController {
  constructor(private readonly service: BatchManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new stock batch / lot number' })
  async createBatch(@Body() dto: CreateBatchDto) {
    return this.service.createBatch(dto);
  }

  @Get(':inventoryItemId')
  @ApiOperation({
    summary: 'List batches for an inventory item (FEFO ordered)',
  })
  async getBatches(@Param('inventoryItemId') inventoryItemId: string) {
    return this.service.getBatches(inventoryItemId);
  }
}
