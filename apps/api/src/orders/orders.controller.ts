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
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @RequirePermission(['orders:write', 'pos:write'])
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateOrderDto,
  ) {
    const data = await this.ordersService.createOrder(req.user, dto);
    return apiSuccess(data, 'Order created');
  }

  @Get()
  @RequirePermission(['orders:read', 'kitchen:read', 'pos:read'])
  async getOrders(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.ordersService.getOrders(req.user));
  }

  @Get(':id')
  @RequirePermission(['orders:read', 'kitchen:read', 'pos:read'])
  async getOrderById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(await this.ordersService.getOrderById(req.user, id));
  }

  @Post(':id/checkout')
  @RequirePermission(['payments:write', 'pos:write'])
  async checkoutOrder(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CheckoutOrderDto,
  ) {
    const data = await this.ordersService.checkoutOrder(req.user, id, dto);
    return apiSuccess(data, 'Order checked out');
  }

  @Patch(':id/status')
  @RequirePermission(['orders:write', 'kitchen:write'])
  async updateOrderStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const data = await this.ordersService.updateOrderStatus(req.user, id, dto);
    return apiSuccess(data, 'Order status updated');
  }

  @Delete(':id')
  @RequirePermission('orders:write')
  async deleteOrder(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const data = await this.ordersService.deleteOrder(req.user, id);
    return apiSuccess(data, 'Order deleted');
  }
}
