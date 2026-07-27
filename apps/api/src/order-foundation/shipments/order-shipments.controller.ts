import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderShipmentsService } from './order-shipments.service';
import { CreateShipmentDto } from './create-shipment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/shipments')
export class OrderShipmentsController {
  constructor(private readonly service: OrderShipmentsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create shipment record for order (Shipment, Packages, Carrier, Tracking)',
  })
  async createShipment(
    @Param('orderId') orderId: string,
    @Body() dto: CreateShipmentDto,
  ) {
    return this.service.createShipment(orderId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List shipments for an order' })
  async getShipments(@Param('orderId') orderId: string) {
    return this.service.getShipments(orderId);
  }
}
