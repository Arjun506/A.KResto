import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantOpsService } from './restaurant-ops.service';
import { CreateRestaurantShiftDto } from './dto/create-shift.dto';
import { RestaurantCheckoutDto } from './dto/restaurant-checkout.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@ApiTags('Restaurant Pack — Operations & Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant-ops')
export class RestaurantOpsController {
  constructor(private readonly service: RestaurantOpsService) {}

  @Post('shifts')
  @ApiOperation({ summary: 'Register employee shift' })
  async createShift(
    @Body() body: CreateRestaurantShiftDto & { tenantId?: string },
  ) {
    return this.service.createShift(body.tenantId || 'GLOBAL', body);
  }

  @Post('checkout')
  @ApiOperation({
    summary:
      'Process POS menu checkout integrating Order, Payment, and CRM Foundations',
  })
  async checkoutOrder(
    @Body() body: RestaurantCheckoutDto & { tenantId?: string },
  ) {
    return this.service.checkoutOrder(body.tenantId || 'GLOBAL', body);
  }

  @Post('tables/:id/waiter')
  @ApiOperation({ summary: 'Assign waiter to a table' })
  async assignWaiter(
    @Param('id') id: string,
    @Body() body: { employeeId: string },
  ) {
    return this.service.assignWaiter(id, body.employeeId);
  }

  @Post('orders/:id/delivery')
  @ApiOperation({
    summary: 'Dispatch order delivery via partners (UberEats, DoorDash)',
  })
  async dispatchDelivery(
    @Param('id') id: string,
    @Body() body: { provider: string },
  ) {
    return this.service.dispatchDelivery(id, body.provider);
  }
}
