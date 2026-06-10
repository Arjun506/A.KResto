import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'SUPER_ADMIN',
  )
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    const data = await this.ordersService.createOrder(req.user, dto);
    return apiSuccess(data, 'Order created');
  }

  @Get()
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getOrders(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.ordersService.getOrders(req.user));
  }

  @Get(':id')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async getOrderById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(await this.ordersService.getOrderById(req.user, id));
  }

  @Patch(':id/status')
  @Roles(
    'OWNER',
    'RESTAURANT_OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'CHEF',
    'SUPER_ADMIN',
  )
  async updateOrderStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const data = await this.ordersService.updateOrderStatus(req.user, id, dto);
    return apiSuccess(data, 'Order status updated');
  }

  @Delete(':id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CASHIER', 'SUPER_ADMIN')
  async deleteOrder(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const data = await this.ordersService.deleteOrder(req.user, id);
    return apiSuccess(data, 'Order deleted');
  }
}
