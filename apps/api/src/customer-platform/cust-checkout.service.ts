import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  CartUpdatedEvent,
  CheckoutCompletedEvent,
} from '../event-bus/events/cust.events';

@Injectable()
export class CustCheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateCart(
    tenantId: string,
    customerId: string,
    businessId: string,
    items: any[],
  ) {
    const cart = await this.prisma.cust_carts.create({
      data: {
        tenantId,
        customerId,
        businessId,
        itemsJson: items,
      },
    });

    await this.eventBus.publish(
      new CartUpdatedEvent(
        cart.id,
        { cartId: cart.id, itemsCount: items.length },
        tenantId,
      ),
    );

    return cart;
  }

  async processCheckout(
    tenantId: string,
    customerId: string,
    businessId: string,
    amount: number,
  ) {
    const orderNumber = `CUST-ORD-${Date.now()}`;

    // 1. Consume Order Foundation: Create order
    const order = await this.prisma.universal_orders.create({
      data: {
        tenantId,
        orderNumber,
        customerId,
        grandTotal: amount,
        type: 'SALES_ORDER',
        status: 'DRAFT',
      },
    });

    // 2. Consume Payment Foundation: Record transaction
    const payment = await this.prisma.payment_transactions.create({
      data: {
        tenantId,
        customerId,
        paymentNumber: `CUST-PAY-${Date.now()}`,
        amount,
        currency: 'USD',
        status: 'CAPTURED',
        methodType: 'CREDIT_CARD',
      },
    });

    await this.eventBus.publish(
      new CheckoutCompletedEvent(
        order.id,
        { orderId: order.id, amount },
        tenantId,
      ),
    );

    return {
      orderId: order.id,
      orderNumber,
      paymentId: payment.id,
      status: 'PAID',
    };
  }
}
