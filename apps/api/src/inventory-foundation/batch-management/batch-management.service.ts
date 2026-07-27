import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBatchDto } from './create-batch.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BatchCreatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class BatchManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createBatch(dto: CreateBatchDto) {
    const batch = await this.prisma.inventory_batches.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        batchNumber: dto.batchNumber,
        supplierBatchNo: dto.supplierBatchNo,
        manufacturedAt: dto.manufacturedAt
          ? new Date(dto.manufacturedAt)
          : null,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        quantityOnHand: dto.quantityOnHand ?? 0,
      },
    });

    await this.eventBus.publish(
      new BatchCreatedEvent(batch.id, {
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        inventoryItemId: dto.inventoryItemId,
      }),
    );

    return batch;
  }

  async getBatches(inventoryItemId: string) {
    return this.prisma.inventory_batches.findMany({
      where: { inventoryItemId },
      orderBy: { expiresAt: 'asc' },
    });
  }
}
