import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SmartRoutingService } from './smart-routing.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Smart Routing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/route')
export class SmartRoutingController {
  constructor(private readonly service: SmartRoutingService) {}

  @Post()
  @ApiOperation({
    summary:
      'Run smart routing rules (Distance, Stock Availability, Hours, Capacity) to assign optimal fulfillment node',
  })
  async routeOrder(@Param('orderId') orderId: string) {
    return this.service.routeOrderToFulfillmentNode(orderId);
  }
}
