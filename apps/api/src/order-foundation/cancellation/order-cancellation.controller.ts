import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderCancellationService } from './order-cancellation.service';
import { CancelOrderDto } from './cancel-order.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Cancellation Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/cancel')
export class OrderCancellationController {
  constructor(private readonly service: OrderCancellationService) {}

  @Post()
  @ApiOperation({
    summary:
      'Cancel order with reason code and trigger automated stock reservation release',
  })
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body() dto: CancelOrderDto,
    @Req() req: any,
  ) {
    return this.service.cancelOrder(orderId, dto, req.user?.id);
  }
}
