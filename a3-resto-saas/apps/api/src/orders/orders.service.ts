import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderStatus as PrismaOrderStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { OrderResponseDto } from './dto/order-response.dto';
import {
  isEnterpriseOrderStatus,
  mapPrismaStatusToEnterpriseStatus,
  ORDER_STATUS_TRANSITIONS,
  OrderStatus,
} from './order-status';
import { OrdersGateway } from '../gateways/orders.gateway';

type OrderWithItems = Prisma.ordersGetPayload<{
  include: { order_items: true };
}>;

type TenantWhere = {
  restaurantId?: string;
};

type DeleteOrderResult = {
  id: string;
  restaurantId: string;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  private isSuperAdmin(user: JwtUser | undefined): boolean {
    return user?.role === 'SUPER_ADMIN';
  }

  private getRestaurantIdFromUser(user: JwtUser | undefined): string {
    if (!user?.restaurantId) {
      throw new ForbiddenException('Missing restaurantId for tenant access');
    }

    return user.restaurantId;
  }

  private getTenantWhere(user: JwtUser | undefined): TenantWhere {
    if (this.isSuperAdmin(user) && !user?.restaurantId) {
      return {};
    }

    return { restaurantId: this.getRestaurantIdFromUser(user) };
  }

  async createOrder(
    user: JwtUser | undefined,
    dto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    const restaurantId = this.getRestaurantIdFromUser(user);

    const [table, menuItems] = await Promise.all([
      this.prisma.tables.findFirst({
        where: { id: dto.tableId, restaurantId, isActive: true },
        select: { id: true },
      }),
      this.prisma.menu_items.findMany({
        where: {
          id: { in: dto.items.map((i) => i.menuItemId) },
          restaurantId,
          isAvailable: true,
        },
        select: { id: true, price: true },
      }),
    ]);

    if (!table) {
      throw new BadRequestException('Table is invalid for this restaurant');
    }

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('One or more menu items are invalid');
    }

    const menuPriceById = new Map<string, number>(
      menuItems.map((m) => [m.id, Number(m.price)] as const),
    );

    const total = dto.items.reduce((acc: number, item) => {
      const priceUnknown = menuPriceById.get(item.menuItemId);
      if (priceUnknown === undefined) return acc;

      const priceNum =
        typeof priceUnknown === 'number' ? priceUnknown : Number(priceUnknown);

      return acc + priceNum * item.quantity;
    }, 0);

    const now = new Date();
    const created = await this.prisma.orders.create({
      data: {
        id: randomUUID(),
        orderNumber: dto.orderNumber ?? this.generateOrderNumber(),
        customerName: dto.customerName ?? null,
        customerPhone: dto.customerPhone ?? null,
        status: 'PENDING',
        totalAmount: total,
        restaurantId,
        tableId: dto.tableId,
        updatedAt: now,
        order_items: {
          create: dto.items.map((item) => {
            const priceUnknown = menuPriceById.get(item.menuItemId);
            if (priceUnknown === undefined) {
              throw new BadRequestException('Invalid menu item');
            }

            const priceNum =
              typeof priceUnknown === 'number'
                ? priceUnknown
                : Number(priceUnknown);

            return {
              id: randomUUID(),
              quantity: item.quantity,
              price: priceNum,
              notes: item.notes ?? null,
              menuItemId: item.menuItemId,
              updatedAt: now,
            };
          }),
        },
      },
      include: {
        order_items: true,
      },
    });

    const response = this.toOrderResponse(created);
    this.ordersGateway.emitOrderCreated(response);
    return response;
  }

  async getOrders(user: JwtUser | undefined): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.orders.findMany({
      where: this.getTenantWhere(user),
      orderBy: { createdAt: 'desc' },
      include: { order_items: true },
    });

    return orders.map((o) => this.toOrderResponse(o));
  }

  async getOrderById(
    user: JwtUser | undefined,
    id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.orders.findFirst({
      where: { id, ...this.getTenantWhere(user) },
      include: { order_items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async updateOrderStatus(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    if (!isEnterpriseOrderStatus(dto.status)) {
      throw new BadRequestException('Invalid order status');
    }

    const existing = await this.prisma.orders.findFirst({
      where: { id, ...this.getTenantWhere(user) },
      include: { order_items: true },
    });

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const currentEnterpriseStatus = mapPrismaStatusToEnterpriseStatus(
      existing.status,
    );

    const allowed =
      ORDER_STATUS_TRANSITIONS[currentEnterpriseStatus] ?? new Set();
    if (!allowed.has(dto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    const prismaStatus = this.mapEnterpriseToPrisma(dto.status);

    const tenantWhere = this.getTenantWhere(user);

    await this.prisma.orders.updateMany({
      where: { id, ...tenantWhere },
      data: { status: prismaStatus, updatedAt: new Date() },
    });

    const updated = await this.prisma.orders.findFirst({
      where: { id, ...tenantWhere },
      include: { order_items: true },
    });

    if (!updated) {
      throw new NotFoundException('Order not found');
    }

    const response = this.toOrderResponse(updated);
    this.ordersGateway.emitOrderStatusChanged(response);
    return response;
  }

  async deleteOrder(
    user: JwtUser | undefined,
    id: string,
  ): Promise<DeleteOrderResult> {
    const existing = await this.prisma.orders.findFirst({
      where: { id, ...this.getTenantWhere(user) },
      select: { id: true, restaurantId: true },
    });

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    await this.prisma.orders.deleteMany({
      where: { id, ...this.getTenantWhere(user) },
    });

    const result = { id: existing.id, restaurantId: existing.restaurantId };
    this.ordersGateway.emitOrderDeleted(existing.restaurantId, {
      id: existing.id,
    });
    return result;
  }

  private toOrderResponse(order: OrderWithItems): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      status: mapPrismaStatusToEnterpriseStatus(order.status),
      totalAmount: String(order.totalAmount),
      restaurantId: order.restaurantId,
      tableId: order.tableId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.order_items.map((it) => ({
        id: it.id,
        quantity: it.quantity,
        price: String(it.price),
        notes: it.notes,
        menuItemId: it.menuItemId,
      })),
    };
  }

  private mapEnterpriseToPrisma(status: OrderStatus): PrismaOrderStatus {
    return status;
  }

  private generateOrderNumber() {
    // Simple deterministic placeholder; can be replaced with restaurant-specific counter.
    return `ORD-${Date.now()}`;
  }
}
