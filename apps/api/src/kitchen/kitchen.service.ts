import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';
import { OrdersGateway } from '../gateways/orders.gateway';
import { UpdateKitchenTicketStatusDto, KitchenTicketStatus } from './dto/update-kitchen-ticket-status.dto';
import { UpdateKitchenTicketPriorityDto } from './dto/update-kitchen-ticket-priority.dto';
import { Prisma } from '@prisma/client';

type PrismaWriteClient = PrismaService | Prisma.TransactionClient;

const TICKET_STATUS_TRANSITIONS: Record<string, ReadonlySet<string>> = {
  PENDING: new Set(['PREPARING', 'CANCELLED']),
  PREPARING: new Set(['READY', 'CANCELLED']),
  READY: new Set(['SERVED', 'CANCELLED']),
  SERVED: new Set(),
  CANCELLED: new Set(),
};

@Injectable()
export class KitchenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  private getTenantWhere(user: JwtUser | undefined) {
    if (!user?.tenantId) {
      return {};
    }
    return { tenantId: user.tenantId };
  }

  async getTickets(
    user: JwtUser | undefined,
    stationCode?: string,
    status?: string,
  ) {
    const tenantWhere = this.getTenantWhere(user);

    const where: any = { ...tenantWhere };
    if (stationCode && stationCode !== 'ALL') {
      where.stationCode = stationCode;
    }
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const tickets = await this.prisma.kitchen_tickets.findMany({
      where,
      include: {
        ticket_items: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            tableId: true,
            createdAt: true,
            tables: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets.map((t) => this.formatTicketResponse(t));
  }

  async getTicketById(user: JwtUser | undefined, id: string) {
    const tenantWhere = this.getTenantWhere(user);

    const ticket = await this.prisma.kitchen_tickets.findFirst({
      where: { id, ...tenantWhere },
      include: {
        ticket_items: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            tableId: true,
            createdAt: true,
            tables: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    return this.formatTicketResponse(ticket);
  }

  async createTicketsForOrder(
    client: PrismaWriteClient,
    tenantId: string,
    orderId: string,
  ) {
    const order = await client.orders.findFirst({
      where: { id: orderId, tenantId },
      include: {
        order_items: {
          include: {
            menu_items: {
              select: {
                name: true,
                stationCode: true,
              },
            },
          },
        },
      },
    });

    if (!order || order.order_items.length === 0) {
      return [];
    }

    // Group items by stationCode
    const itemsByStation = new Map<
      string,
      Array<{
        orderItemId: string;
        menuItemId: string;
        name: string;
        quantity: number;
        notes?: string | null;
      }>
    >();

    for (const item of order.order_items) {
      const station = item.menu_items?.stationCode || 'MAIN_KITCHEN';
      const list = itemsByStation.get(station) ?? [];
      list.push({
        orderItemId: item.id,
        menuItemId: item.menuItemId,
        name: item.menu_items?.name ?? 'Menu Item',
        quantity: item.quantity,
        notes: item.notes,
      });
      itemsByStation.set(station, list);
    }

    const createdTickets: any[] = [];

    for (const [stationCode, items] of itemsByStation.entries()) {
      // Check if ticket already exists for this order & station (IDEMPOTENT)
      const existingTicket = await client.kitchen_tickets.findUnique({
        where: {
          orderId_stationCode: {
            orderId: order.id,
            stationCode,
          },
        },
        include: { ticket_items: true },
      });

      if (existingTicket) {
        createdTickets.push(existingTicket);
        continue;
      }

      const ticket = await client.kitchen_tickets.create({
        data: {
          tenantId,
          orderId: order.id,
          stationCode,
          status: 'PENDING',
          priority: 'NORMAL',
          notes: items.map((i) => i.notes).filter(Boolean).join(' | ') || null,
          ticket_items: {
            create: items.map((i) => ({
              orderItemId: i.orderItemId,
              menuItemId: i.menuItemId,
              name: i.name,
              quantity: i.quantity,
              notes: i.notes ?? null,
            })),
          },
        },
        include: {
          ticket_items: true,
          orders: {
            select: {
              id: true,
              orderNumber: true,
              customerName: true,
              customerPhone: true,
              tableId: true,
              createdAt: true,
              tables: { select: { name: true, code: true } },
            },
          },
        },
      });

      createdTickets.push(ticket);

      const formatted = this.formatTicketResponse(ticket);
      this.ordersGateway.emitToTenant(tenantId, 'kitchenTicketCreated', formatted);
    }

    return createdTickets;
  }

  async updateTicketStatus(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateKitchenTicketStatusDto,
  ) {
    const tenantWhere = this.getTenantWhere(user);

    const existing = await this.prisma.kitchen_tickets.findFirst({
      where: { id, ...tenantWhere },
    });

    if (!existing) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    const allowed = TICKET_STATUS_TRANSITIONS[existing.status] ?? new Set();
    if (!allowed.has(dto.status)) {
      throw new BadRequestException(
        `Invalid kitchen ticket status transition from ${existing.status} to ${dto.status}`,
      );
    }

    const now = new Date();
    const updateData: any = {
      status: dto.status,
      updatedAt: now,
    };

    if (dto.status === 'PREPARING' && !existing.prepStartedAt) {
      updateData.prepStartedAt = now;
    } else if (dto.status === 'READY' && !existing.prepCompletedAt) {
      updateData.prepCompletedAt = now;
    } else if (dto.status === 'SERVED' && !existing.servedAt) {
      updateData.servedAt = now;
    }

    const updated = await this.prisma.kitchen_tickets.update({
      where: { id },
      data: updateData,
      include: {
        ticket_items: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            tableId: true,
            createdAt: true,
            tables: { select: { name: true, code: true } },
          },
        },
      },
    });

    const formatted = this.formatTicketResponse(updated);
    this.ordersGateway.emitToTenant(updated.tenantId, 'kitchenTicketUpdated', formatted);
    this.ordersGateway.emitToTenant(updated.tenantId, 'kitchenTicketStatusChanged', {
      id: updated.id,
      orderId: updated.orderId,
      stationCode: updated.stationCode,
      status: updated.status,
    });

    // Check if all tickets for this order are READY or SERVED
    await this.syncOrderStatusFromTickets(updated.orderId, updated.tenantId);

    return formatted;
  }

  async updateTicketPriority(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateKitchenTicketPriorityDto,
  ) {
    const tenantWhere = this.getTenantWhere(user);

    const existing = await this.prisma.kitchen_tickets.findFirst({
      where: { id, ...tenantWhere },
    });

    if (!existing) {
      throw new NotFoundException('Kitchen ticket not found');
    }

    const updated = await this.prisma.kitchen_tickets.update({
      where: { id },
      data: { priority: dto.priority, updatedAt: new Date() },
      include: {
        ticket_items: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            tableId: true,
            createdAt: true,
            tables: { select: { name: true, code: true } },
          },
        },
      },
    });

    const formatted = this.formatTicketResponse(updated);
    this.ordersGateway.emitToTenant(updated.tenantId, 'kitchenTicketUpdated', formatted);
    return formatted;
  }

  private async syncOrderStatusFromTickets(orderId: string, tenantId: string) {
    const allTickets = await this.prisma.kitchen_tickets.findMany({
      where: { orderId, tenantId },
      select: { status: true },
    });

    if (allTickets.length === 0) return;

    const statuses = allTickets.map((t) => t.status);

    if (statuses.every((s) => s === 'SERVED')) {
      await this.prisma.orders.updateMany({
        where: { id: orderId, tenantId },
        data: { status: 'COMPLETED', updatedAt: new Date() },
      });
    } else if (statuses.every((s) => s === 'READY' || s === 'SERVED')) {
      await this.prisma.orders.updateMany({
        where: { id: orderId, tenantId, status: { not: 'COMPLETED' } },
        data: { status: 'READY', updatedAt: new Date() },
      });
    } else if (statuses.some((s) => s === 'PREPARING' || s === 'READY')) {
      await this.prisma.orders.updateMany({
        where: { id: orderId, tenantId, status: 'PENDING' },
        data: { status: 'PREPARING', updatedAt: new Date() },
      });
    }
  }

  private formatTicketResponse(ticket: any) {
    return {
      id: ticket.id,
      tenantId: ticket.tenantId,
      orderId: ticket.orderId,
      orderNumber: ticket.orders?.orderNumber ?? '',
      customerName: ticket.orders?.customerName ?? null,
      customerPhone: ticket.orders?.customerPhone ?? null,
      tableId: ticket.orders?.tableId ?? '',
      tableName: ticket.orders?.tables?.name ?? ticket.orders?.tableId ?? '',
      stationCode: ticket.stationCode,
      status: ticket.status,
      priority: ticket.priority,
      notes: ticket.notes,
      prepStartedAt: ticket.prepStartedAt,
      prepCompletedAt: ticket.prepCompletedAt,
      servedAt: ticket.servedAt,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      items: (ticket.ticket_items ?? []).map((it: any) => ({
        id: it.id,
        orderItemId: it.orderItemId,
        menuItemId: it.menuItemId,
        name: it.name,
        quantity: it.quantity,
        notes: it.notes,
      })),
    };
  }
}
