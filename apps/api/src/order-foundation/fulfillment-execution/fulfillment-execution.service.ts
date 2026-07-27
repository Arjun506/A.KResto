import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateFulfillmentDto } from './update-fulfillment.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  FulfillmentStartedEvent,
  FulfillmentCompletedEvent,
} from '../../event-bus/events/order.events';

@Injectable()
export class FulfillmentExecutionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateFulfillmentStatus(orderId: string, dto: UpdateFulfillmentDto) {
    const order = await this.prisma.universal_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    const updated = await this.prisma.universal_orders.update({
      where: { id: orderId },
      data: { fulfillmentStatus: dto.status },
    });

    if (dto.status === 'PARTIALLY_FULFILLED') {
      await this.eventBus.publish(
        new FulfillmentStartedEvent(orderId, {
          orderId,
          fulfillmentType: order.fulfillmentType,
        }),
      );
    } else if (dto.status === 'FULFILLED') {
      await this.eventBus.publish(
        new FulfillmentCompletedEvent(orderId, { orderId }),
      );
    }

    return updated;
  }
}
