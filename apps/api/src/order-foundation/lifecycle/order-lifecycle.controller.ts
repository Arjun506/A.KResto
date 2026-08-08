import { Controller, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderLifecycleService } from './order-lifecycle.service';
import { UpdateOrderStatusDto } from './update-order-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order-foundation/orders/:id/status')
export class OrderLifecycleController {
  constructor(private readonly service: OrderLifecycleService) {}

  @Patch()
  @ApiOperation({
    summary:
      'Transition order state (Draft, Submitted, Approved, Confirmed, Processing, Fulfilled, Completed, Cancelled)',
  })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateOrderStatus(id, dto, req.user?.id);
  }
}
