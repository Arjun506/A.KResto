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
import { InventoryService } from '../inventory/inventory.service';
import { CheckoutOrderDto } from './dto/checkout-order.dto';
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

type TenantWhere = {
  restaurantId?: string;
};

type DeleteOrderResult = {
  id: string;
  restaurantId: string;
};

type PrismaWriteClient = Prisma.TransactionClient | PrismaService;

type CheckoutOrderResult = {
  order: OrderResponseDto;
  invoice: {
    id: string;
    invoiceNumber: string;
    orderId: string;
    subtotal: string;
    tax: string;
    serviceCharge: string;
    discount: string;
    grandTotal: string;
    pdfUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  payment: {
    id: string;
    orderId: string;
    amount: string;
    paymentMethod: string;
    transactionId?: string | null;
    status: string;
    registerSessionId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  registerSessionId: string;
  inventoryConsumed: Array<{ inventoryItemId: string; quantity: number }>;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
    private readonly inventoryService: InventoryService,
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
    const created = await this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
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
        include: ORDER_ITEMS_INCLUDE,
      });

      await this.writeAuditLog(tx, {
        restaurantId,
        userId: user?.id,
        entity: 'Order',
        entityId: order.id,
        action: 'ORDER_CREATED',
        changes: [
          'created order from authenticated POS/order workflow',
          `items: ${dto.items.length}`,
          `subtotal: ${this.roundMoney(total).toFixed(2)}`,
        ],
        newValues: {
          orderNumber: order.orderNumber,
          tableId: order.tableId,
          status: order.status,
          totalAmount: this.roundMoney(total),
        },
      });

      return order;
    });

    const response = this.toOrderResponse(created);
    this.ordersGateway.emitOrderCreated(response);
    return response;
  }

  async getOrders(user: JwtUser | undefined): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.orders.findMany({
      where: this.getTenantWhere(user),
      orderBy: { createdAt: 'desc' },
      include: ORDER_ITEMS_INCLUDE,
    });

    return orders.map((o) => this.toOrderResponse(o));
  }

  async getOrderById(
    user: JwtUser | undefined,
    id: string,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.orders.findFirst({
      where: { id, ...this.getTenantWhere(user) },
      include: ORDER_ITEMS_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  async checkoutOrder(
    user: JwtUser | undefined,
    id: string,
    dto: CheckoutOrderDto,
  ): Promise<CheckoutOrderResult> {
    const restaurantId = this.getRestaurantIdFromUser(user);
    const userId = user?.id;
    if (!userId) {
      throw new ForbiddenException('Missing user context for checkout');
    }

    const checkout = await this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.findFirst({
        where: { id, restaurantId },
        include: {
          order_items: {
            include: {
              menu_items: { select: { name: true } },
            },
          },
          payments: { where: { status: 'SUCCESS' } },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status === 'CANCELLED') {
        throw new BadRequestException('Cancelled orders cannot be checked out');
      }

      const subtotal = this.roundMoney(Number(order.totalAmount));
      const discount = this.roundMoney(dto.discount);
      const tax = this.roundMoney(dto.tax);
      const serviceCharge = this.roundMoney(dto.serviceCharge);

      if (discount > subtotal) {
        throw new BadRequestException('Discount cannot exceed subtotal');
      }

      const grandTotal = this.roundMoney(
        subtotal - discount + tax + serviceCharge,
      );

      if (!this.moneyMatches(dto.amount, grandTotal)) {
        throw new BadRequestException(
          `Payment amount must match invoice total ${grandTotal.toFixed(2)}`,
        );
      }

      const paidTotal = this.roundMoney(
        order.payments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      );

      if (paidTotal > 0) {
        throw new BadRequestException('Order already has a successful payment');
      }

      const registerSession = await tx.pos_register_sessions.findFirst({
        where: {
          tenantId: restaurantId,
          cashierId: userId,
          status: 'OPEN',
        },
        select: { id: true },
      });

      if (!registerSession) {
        throw new BadRequestException(
          'Open cash register session required before checkout',
        );
      }

      const inventoryConsumed = await this.inventoryService.consumeForOrder(tx, {
        restaurantId,
        orderId: order.id,
        items: order.order_items.map((item) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      });

      const invoice = await tx.invoices.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          invoiceNumber: this.generateInvoiceNumber(order.orderNumber),
          subtotal,
          tax,
          serviceCharge,
          discount,
          grandTotal,
        },
        update: {
          subtotal,
          tax,
          serviceCharge,
          discount,
          grandTotal,
        },
      });

      const payment = await tx.order_payments.create({
        data: {
          orderId: order.id,
          amount: grandTotal,
          paymentMethod: dto.paymentMethod,
          transactionId: dto.transactionId ?? null,
          status: 'SUCCESS',
          registerSessionId: registerSession.id,
        },
      });

      await this.writeAuditLog(tx, {
        restaurantId,
        userId,
        entity: 'Invoice',
        entityId: invoice.id,
        action: 'INVOICE_CREATED',
        changes: [
          `order: ${order.orderNumber}`,
          `subtotal: ${subtotal.toFixed(2)}`,
          `grandTotal: ${grandTotal.toFixed(2)}`,
        ],
        newValues: {
          invoiceNumber: invoice.invoiceNumber,
          orderId: order.id,
          subtotal,
          tax,
          serviceCharge,
          discount,
          grandTotal,
        },
      });

      await this.writeAuditLog(tx, {
        restaurantId,
        userId,
        entity: 'OrderPayment',
        entityId: payment.id,
        action: 'PAYMENT_RECORDED',
        changes: [
          `order: ${order.orderNumber}`,
          `method: ${payment.paymentMethod}`,
          `amount: ${grandTotal.toFixed(2)}`,
        ],
        newValues: {
          orderId: order.id,
          paymentMethod: payment.paymentMethod,
          amount: grandTotal,
          registerSessionId: registerSession.id,
          status: payment.status,
        },
      });

      await this.writeAuditLog(tx, {
        restaurantId,
        userId,
        entity: 'Order',
        entityId: order.id,
        action: 'ORDER_CHECKED_OUT',
        changes: [
          'settled order through POS checkout',
          `payment: ${payment.paymentMethod}`,
          `invoice: ${invoice.invoiceNumber}`,
        ],
        newValues: {
          orderNumber: order.orderNumber,
          invoiceId: invoice.id,
          paymentId: payment.id,
          registerSessionId: registerSession.id,
        },
      });

      if (inventoryConsumed.length > 0) {
        await this.writeAuditLog(tx, {
          restaurantId,
          userId,
          entity: 'Order',
          entityId: order.id,
          action: 'INVENTORY_CONSUMED',
          changes: inventoryConsumed.map(
            (item) =>
              `inventory ${item.inventoryItemId}: -${item.quantity.toFixed(2)}`,
          ),
          newValues: {
            orderNumber: order.orderNumber,
            consumed: inventoryConsumed,
          },
        });
      }

      await tx.orders.update({
        where: { id: order.id },
        data: { status: 'COMPLETED', updatedAt: new Date() },
      });

      const updated = await tx.orders.findFirst({
        where: { id: order.id, restaurantId },
        include: ORDER_ITEMS_INCLUDE,
      });

      if (!updated) {
        throw new NotFoundException('Order not found after checkout');
      }

      return {
        order: updated,
        invoice,
        payment,
        registerSessionId: registerSession.id,
        inventoryConsumed,
      };
    });

    const orderResponse = this.toOrderResponse(checkout.order);
    this.ordersGateway.emitOrderUpdated(orderResponse);

    return {
      order: orderResponse,
      invoice: {
        id: checkout.invoice.id,
        invoiceNumber: checkout.invoice.invoiceNumber,
        orderId: checkout.invoice.orderId,
        subtotal: String(checkout.invoice.subtotal),
        tax: String(checkout.invoice.tax),
        serviceCharge: String(checkout.invoice.serviceCharge),
        discount: String(checkout.invoice.discount),
        grandTotal: String(checkout.invoice.grandTotal),
        pdfUrl: checkout.invoice.pdfUrl,
        createdAt: checkout.invoice.createdAt,
        updatedAt: checkout.invoice.updatedAt,
      },
      payment: {
        id: checkout.payment.id,
        orderId: checkout.payment.orderId,
        amount: String(checkout.payment.amount),
        paymentMethod: checkout.payment.paymentMethod,
        transactionId: checkout.payment.transactionId,
        status: checkout.payment.status,
        registerSessionId: checkout.payment.registerSessionId,
        createdAt: checkout.payment.createdAt,
        updatedAt: checkout.payment.updatedAt,
      },
      registerSessionId: checkout.registerSessionId,
      inventoryConsumed: checkout.inventoryConsumed,
    };
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
      include: ORDER_ITEMS_INCLUDE,
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
      include: ORDER_ITEMS_INCLUDE,
    });

    if (!updated) {
      throw new NotFoundException('Order not found');
    }

    await this.writeAuditLog(this.prisma, {
      restaurantId: updated.restaurantId,
      userId: user?.id,
      entity: 'Order',
      entityId: updated.id,
      action: 'ORDER_STATUS_CHANGED',
      changes: [
        `status: ${currentEnterpriseStatus} -> ${dto.status}`,
        `order: ${updated.orderNumber}`,
      ],
      oldValues: { status: currentEnterpriseStatus },
      newValues: { status: dto.status },
    });

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
        name: it.menu_items?.name ?? null,
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

  private generateInvoiceNumber(orderNumber: string) {
    return `INV-${orderNumber}-${Date.now()}`;
  }

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private moneyMatches(left: number, right: number): boolean {
    return Math.abs(this.roundMoney(left) - this.roundMoney(right)) <= 0.01;
  }

  private async writeAuditLog(
    client: PrismaWriteClient,
    data: {
      restaurantId: string;
      userId?: string | null;
      entity: string;
      entityId: string;
      action: string;
      changes: string[];
      oldValues?: Prisma.InputJsonValue;
      newValues?: Prisma.InputJsonValue;
    },
  ) {
    await client.audit_logs.create({
      data: {
        restaurantId: data.restaurantId,
        userId: data.userId ?? null,
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        changes: data.changes,
        oldValues: data.oldValues,
        newValues: data.newValues,
      },
    });
  }
}
