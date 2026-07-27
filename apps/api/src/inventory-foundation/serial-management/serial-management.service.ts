import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignSerialDto } from './assign-serial.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { SerialAssignedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class SerialManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async assignSerial(dto: AssignSerialDto) {
    const serial = await this.prisma.inventory_serials.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        serialNumber: dto.serialNumber,
        status: 'IN_STOCK',
        warehouseId: dto.warehouseId,
        locationId: dto.locationId,
      },
    });

    await this.eventBus.publish(
      new SerialAssignedEvent(serial.id, {
        serialId: serial.id,
        serialNumber: serial.serialNumber,
        inventoryItemId: dto.inventoryItemId,
      }),
    );

    return serial;
  }

  async getSerials(inventoryItemId: string) {
    return this.prisma.inventory_serials.findMany({
      where: { inventoryItemId },
    });
  }
}
