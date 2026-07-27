import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRestaurantShiftDto } from './dto/create-shift.dto';
import { RestaurantCheckoutDto } from './dto/restaurant-checkout.dto';
import { EventBusService } from '../../../event-bus/event-bus.service';
import {
  ShiftStartedEvent,
  RestaurantOrderPlacedEvent,
} from '../../../event-bus/events/restaurant.events';

@Injectable()
export class RestaurantOpsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  // Shift Management
  async createShift(tenantId: string, dto: CreateRestaurantShiftDto) {
    const shift = await this.prisma.rest_shifts.create({
      data: {
        tenantId,
        employeeId: dto.employeeId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        role: dto.role,
      },
    });

    await this.eventBus.publish(
      new ShiftStartedEvent(
        shift.id,
        { shiftId: shift.id, employeeId: dto.employeeId },
        tenantId,
      ),
    );

    return shift;
  }

  // POS Order Register checkout consuming Order, Payment, and CRM Foundations
  async checkoutOrder(tenantId: string, dto: RestaurantCheckoutDto) {
    const orderNumber = `RST-ORD-${Date.now()}`;

    // 1. Consume Order Foundation: Create universal order
    const order = await this.prisma.universal_orders.create({
      data: {
        tenantId,
        orderNumber,
        customerId: dto.customerId,
        grandTotal: dto.amount,
        type: 'SALES_ORDER',
        status: 'DRAFT',
      },
    });

    // 2. Consume Payment Foundation: Record transaction
    const payment = await this.prisma.payment_transactions.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        paymentNumber: `PAY-RST-${Date.now()}`,
        amount: dto.amount,
        currency: 'USD',
        status: 'CAPTURED',
        methodType: 'CREDIT_CARD',
      },
    });

    // Update order status to paid / completed
    const paidOrder = await this.prisma.universal_orders.update({
      where: { id: order.id },
      data: { status: 'COMPLETED' },
    });

    // 3. Consume CRM Foundation: Award loyalty points if registered customer exists
    if (dto.customerId) {
      const loyalty = await this.prisma.crm_loyalty.findUnique({
        where: { customerId: dto.customerId },
      });
      if (loyalty) {
        await this.prisma.crm_loyalty.update({
          where: { id: loyalty.id },
          data: {
            pointsTotal: loyalty.pointsTotal + Math.floor(dto.amount),
          },
        });
      }
    }

    await this.eventBus.publish(
      new RestaurantOrderPlacedEvent(
        order.id,
        { orderId: order.id, tableNumber: dto.tableNumber },
        tenantId,
      ),
    );

    return {
      orderId: order.id,
      orderNumber: paidOrder.orderNumber,
      paymentId: payment.id,
      status: 'PAID',
    };
  }

  // Waiter assignments & captain consoles
  async assignWaiter(tableId: string, waiterEmployeeId: string) {
    return {
      tableId,
      waiterEmployeeId,
      status: 'ASSIGNED',
    };
  }

  // Delivery partner mock integrations
  async dispatchDelivery(orderId: string, provider: string) {
    return {
      orderId,
      provider,
      trackingCode: `DEL-${Date.now()}`,
      status: 'DISPATCHED',
    };
  }
}
