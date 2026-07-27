import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockTransfersService } from './stock-transfers.service';
import { CreateTransferDto } from './create-transfer.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Stock Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-transfers')
export class StockTransfersController {
  constructor(private readonly service: StockTransfersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create inter-warehouse stock transfer requisition',
  })
  async createTransfer(@Body() dto: CreateTransferDto) {
    return this.service.createTransfer(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List stock transfer requisitions' })
  async getTransfers() {
    return this.service.getTransfers();
  }
}
