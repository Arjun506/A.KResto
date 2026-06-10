import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../gateways/orders.gateway';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { WaiterRequestDto } from './dto/waiter-request.dto';
import { mapPrismaStatusToEnterpriseStatus } from '../orders/order-status';
import type { OrderResponseDto } from '../orders/dto/order-response.dto';

type OrderWithItems = Prisma.ordersGetPayload<{
  include: { order_items: true };
}>;

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async getRestaurant(restaurantSlug: string) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }
    return restaurant;
  }

  async getMenu(restaurantSlug: string) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    return this.prisma.menu_items.findMany({
      where: {
        restaurantId: restaurant.id,
        isAvailable: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategories(restaurantSlug: string) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    return this.prisma.categories.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createOrder(dto: CreatePublicOrderDto): Promise<OrderResponseDto> {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { slug: dto.restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id: dto.tableId, restaurantId: restaurant.id },
    });
    if (!table || !table.isActive) {
      throw new NotFoundException('Table is invalid or inactive');
    }

    // QR validation
    if (table.qrCode && table.qrCode !== dto.qrToken) {
      throw new ForbiddenException('Invalid QR Token for this table');
    }

    const menuItems = await this.prisma.menu_items.findMany({
      where: {
        id: { in: dto.items.map((i) => i.menuItemId) },
        restaurantId: restaurant.id,
        isAvailable: true,
      },
    });

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('One or more menu items are invalid or unavailable');
    }

    const priceMap = new Map<string, number>(
      menuItems.map((m) => [m.id, Number(m.price)] as const),
    );

    const total = dto.items.reduce((acc, item) => {
      const price = priceMap.get(item.menuItemId) || 0;
      return acc + price * item.quantity;
    }, 0);

    const now = new Date();
    const created = await this.prisma.orders.create({
      data: {
        id: randomUUID(),
        orderNumber: `ORD-${Date.now()}`,
        customerName: dto.customerName ?? null,
        customerPhone: dto.phone ?? null,
        status: 'PENDING',
        totalAmount: total,
        restaurantId: restaurant.id,
        tableId: table.id,
        updatedAt: now,
        order_items: {
          create: dto.items.map((item) => ({
            id: randomUUID(),
            quantity: item.quantity,
            price: priceMap.get(item.menuItemId) || 0,
            notes: item.notes ?? null,
            menuItemId: item.menuItemId,
            updatedAt: now,
          })),
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

  async getOrder(orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
      include: { order_items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async handleWaiterRequest(dto: WaiterRequestDto) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { slug: dto.restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id: dto.tableId, restaurantId: restaurant.id },
    });
    if (!table || !table.isActive) {
      throw new NotFoundException('Table is invalid or inactive');
    }

    if (table.qrCode && table.qrCode !== dto.qrToken) {
      throw new ForbiddenException('Invalid QR Token for this table');
    }

    const payload = {
      type: 'WAITER_REQUEST',
      requestType: dto.type,
      tableId: table.id,
      tableName: table.name,
      createdAt: new Date(),
    };

    // Emit to staff room
    this.ordersGateway.server
      .to(`restaurant:${restaurant.id}`)
      .emit('waiterNotification', payload);

    return { success: true, message: 'Waiter notified' };
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
}
