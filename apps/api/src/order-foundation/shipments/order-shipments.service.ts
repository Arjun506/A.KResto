import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShipmentDto } from './create-shipment.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ShipmentCreatedEvent } from '../../event-bus/events/order.events';

@Injectable()
export class OrderShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createShipment(orderId: string, dto: CreateShipmentDto) {
    const shipment = await this.prisma.order_shipments.create({
      data: {
        orderId,
        shipmentNumber: dto.shipmentNumber,
        carrierCode: dto.carrierCode,
        status: dto.status || 'SHIPPED',
        shippedAt: new Date(),
      },
    });

    await this.eventBus.publish(
      new ShipmentCreatedEvent(shipment.id, {
        shipmentId: shipment.id,
        shipmentNumber: shipment.shipmentNumber,
        orderId,
      }),
    );

    return shipment;
  }

  async getShipments(orderId: string) {
    return this.prisma.order_shipments.findMany({
      where: { orderId },
      include: {
        packages: true,
        trackingEvents: true,
        attempts: true,
      },
    });
  }
}
