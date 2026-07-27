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
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto';
import { mapPrismaStatusToEnterpriseStatus } from '../orders/order-status';
import type { OrderResponseDto } from '../orders/dto/order-response.dto';

const ORDER_ITEMS_INCLUDE = {
  order_items: {
    include: {
      menu_items: { select: { name: true } },
    },
  },
} satisfies Prisma.ordersInclude;

type OrderWithItems = Prisma.ordersGetPayload<{
  include: typeof ORDER_ITEMS_INCLUDE;
}>;

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async getRestaurant(restaurantSlug: string) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }
    return restaurant;
  }

  async getMenu(restaurantSlug: string) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    return this.prisma.menu_items.findMany({
      where: {
        tenantId: restaurant.id,
        isAvailable: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategories(restaurantSlug: string) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    return this.prisma.categories.findMany({
      where: {
        tenantId: restaurant.id,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createOrder(dto: CreatePublicOrderDto): Promise<OrderResponseDto> {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: dto.restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id: dto.tableId, tenantId: restaurant.id },
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
        tenantId: restaurant.id,
        isAvailable: true,
      },
    });

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException(
        'One or more menu items are invalid or unavailable',
      );
    }

    const priceMap = new Map<string, number>(
      menuItems.map((m) => [m.id, Number(m.price)] as const),
    );

    const total = dto.items.reduce((acc, item) => {
      const price = priceMap.get(item.menuItemId) || 0;
      return acc + price * item.quantity;
    }, 0);

    const now = new Date();
    const created = await this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          id: randomUUID(),
          orderNumber: `ORD-${Date.now()}`,
          customerName: dto.customerName ?? null,
          customerPhone: dto.phone ?? null,
          status: 'PENDING',
          totalAmount: total,
          tenantId: restaurant.id,
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
        include: ORDER_ITEMS_INCLUDE,
      });

      await tx.audit_logs.create({
        data: {
          tenantId: restaurant.id,
          userId: null,
          entity: 'Order',
          entityId: order.id,
          action: 'PUBLIC_ORDER_CREATED',
          changes: [
            'created order from QR customer ordering workflow',
            `table: ${table.name}`,
            `items: ${dto.items.length}`,
          ],
          newValues: {
            orderNumber: order.orderNumber,
            tableId: table.id,
            totalAmount: total,
          },
        },
      });

      return order;
    });

    const response = this.toOrderResponse(created);
    this.ordersGateway.emitOrderCreated(response);

    // If a customer placing the order checked in using a bookingId, update reservation to SEATED
    if (dto.bookingId) {
      try {
        const booking = await this.prisma.reservations.findUnique({
          where: { id: dto.bookingId },
        });
        if (
          booking &&
          booking.tableId === table.id &&
          ['PENDING', 'CONFIRMED'].includes(booking.status)
        ) {
          await this.prisma.reservations.update({
            where: { id: booking.id },
            data: { status: 'SEATED' },
          });
        }
      } catch (err) {
        console.error('Failed to update booking to SEATED:', err);
      }
    }

    return response;
  }

  async getOrder(orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
      include: ORDER_ITEMS_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async handleWaiterRequest(dto: WaiterRequestDto) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: dto.restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id: dto.tableId, tenantId: restaurant.id },
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
      tenantId: order.tenantId,
      tableId: order.tableId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.order_items.map((it) => ({
        id: it.id,
        quantity: it.quantity,
        price: String(it.price),
        notes: it.notes,
        menuItemId: it.menuItemId,
        name: it.menu_items?.name ?? null,
      })),
    };
  }

  async getRestaurantTables(restaurantSlug: string) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    return this.prisma.tables.findMany({
      where: { tenantId: restaurant.id, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getTableActiveBooking(tableId: string, timeString?: string) {
    const targetTime = timeString ? new Date(timeString) : new Date();

    const reservations = await this.prisma.reservations.findMany({
      where: {
        tableId,
        status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
      },
    });

    // Auto-cancel late bookings (15 minutes grace period)
    const activeReservations: typeof reservations = [];
    for (const r of reservations) {
      const start = new Date(r.reservationAt);
      const diffMins = (targetTime.getTime() - start.getTime()) / (60 * 1000);

      if (diffMins >= 15 && ['PENDING', 'CONFIRMED'].includes(r.status)) {
        await this.prisma.reservations.update({
          where: { id: r.id },
          data: {
            status: 'CANCELLED',
            notes: `${r.notes || ''} [Auto-cancelled due to late arrival at ${targetTime.toISOString()}]`,
          },
        });
      } else {
        activeReservations.push(r);
      }
    }

    const activeBooking = activeReservations.find((r) => {
      const start = new Date(r.reservationAt);
      const duration = r.durationMinutes ?? 60;
      const end = new Date(start.getTime() + duration * 60 * 1000);
      const blockStart = new Date(start.getTime() - 30 * 60 * 1000);

      return targetTime >= blockStart && targetTime <= end;
    });

    if (activeBooking) {
      return {
        hasActiveBooking: true,
        booking: {
          id: activeBooking.id,
          customerName: activeBooking.customerName,
          customerPhone: activeBooking.customerPhone,
          guestCount: activeBooking.guestCount,
          reservationAt: activeBooking.reservationAt,
          durationMinutes: activeBooking.durationMinutes ?? 60,
          status: activeBooking.status,
        },
      };
    }

    return { hasActiveBooking: false };
  }

  async createPublicReservation(dto: CreatePublicReservationDto) {
    const restaurant = await this.prisma.tenant.findUnique({
      where: { slug: dto.restaurantSlug },
    });
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundException('Restaurant not found or inactive');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id: dto.tableId, tenantId: restaurant.id, isActive: true },
    });
    if (!table) {
      throw new NotFoundException('Table is invalid or inactive');
    }

    const start = new Date(dto.reservationAt);
    const duration = dto.durationMinutes ?? 60;
    const end = new Date(start.getTime() + duration * 60 * 1000);

    const existing = await this.prisma.reservations.findMany({
      where: {
        tableId: dto.tableId,
        tenantId: restaurant.id,
        status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
      },
    });

    const isOverlap = existing.some((r) => {
      const rStart = new Date(r.reservationAt);
      const rDuration = r.durationMinutes ?? 60;
      const rEnd = new Date(rStart.getTime() + rDuration * 60 * 1000);
      return start < rEnd && end > rStart;
    });

    if (isOverlap) {
      throw new BadRequestException(
        'Table is not available for this time range',
      );
    }

    return this.prisma.reservations.create({
      data: {
        tenantId: restaurant.id,
        tableId: dto.tableId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone ?? null,
        guestCount: dto.guestCount,
        reservationAt: start,
        durationMinutes: duration,
        notes: dto.notes ?? null,
        status: 'PENDING',
      },
    });
  }
}
