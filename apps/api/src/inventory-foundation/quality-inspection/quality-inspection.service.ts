import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQualityInspectionDto } from './create-inspection.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { InspectionCompletedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class QualityInspectionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createInspection(
    dto: CreateQualityInspectionDto,
    inspectorId?: string,
  ) {
    const inspection = await this.prisma.quality_inspections.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        batchId: dto.batchId,
        inspectionType: dto.inspectionType || 'INCOMING',
        status: dto.status || 'PASSED',
        notes: dto.notes,
        inspectedBy: inspectorId,
      },
    });

    await this.eventBus.publish(
      new InspectionCompletedEvent(inspection.id, {
        inspectionId: inspection.id,
        inventoryItemId: dto.inventoryItemId,
        status: inspection.status,
      }),
    );

    return inspection;
  }

  async getInspections(inventoryItemId: string) {
    return this.prisma.quality_inspections.findMany({
      where: { inventoryItemId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
