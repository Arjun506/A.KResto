import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderSlaService } from './order-sla.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — SLA Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/sla')
export class OrderSlaController {
  constructor(private readonly service: OrderSlaService) {}

  @Post()
  @ApiOperation({
    summary: 'Configure SLA due dates, priority, and target completion',
  })
  async setOrderSla(
    @Param('orderId') orderId: string,
    @Body()
    body: { dueDate?: string; targetCompletionAt?: string; priority?: string },
  ) {
    return this.service.setOrderSla(
      orderId,
      body.dueDate ? new Date(body.dueDate) : undefined,
      body.targetCompletionAt ? new Date(body.targetCompletionAt) : undefined,
      body.priority,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get order SLA & aging details' })
  async getOrderSla(@Param('orderId') orderId: string) {
    return this.service.getOrderSla(orderId);
  }
}
