import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderCalculationSnapshotsService } from './order-calculation-snapshots.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Calculation Snapshots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/snapshots')
export class OrderCalculationSnapshotsController {
  constructor(private readonly service: OrderCalculationSnapshotsService) {}

  @Post()
  @ApiOperation({
    summary: 'Freeze immutable pricing, discount, and tax calculation snapshot',
  })
  async createSnapshot(@Param('orderId') orderId: string) {
    return this.service.createSnapshot(orderId);
  }

  @Get()
  @ApiOperation({ summary: 'List calculation snapshots for an order' })
  async getSnapshots(@Param('orderId') orderId: string) {
    return this.service.getSnapshots(orderId);
  }
}
