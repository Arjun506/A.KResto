import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RecordMovementDto } from './record-movement.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  StockReceivedEvent,
  StockIssuedEvent,
  StockAdjustedEvent,
} from '../../event-bus/events/inventory.events';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async recordMovement(dto: RecordMovementDto, actorId?: string) {
    const unitCost = dto.unitCost ?? 0;
    const totalCost = unitCost * dto.quantity;

    const movement = await this.prisma.stock_movements.create({
      data: {
        tenantId: dto.tenantId,
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        locationId: dto.locationId,
        type: dto.type,
        workflowStatus: 'POSTED',
        quantity: dto.quantity,
        unitCost,
        totalCost,
        referenceNumber: dto.referenceNumber,
        actorId,
        notes: dto.notes,
      },
    });

    // Update Stock Levels balance
    const delta =
      dto.type === 'RECEIPT' ||
      dto.type === 'ADJUSTMENT_ADD' ||
      dto.type === 'TRANSFER_IN'
        ? dto.quantity
        : -dto.quantity;

    await this.prisma.stock_levels.upsert({
      where: {
        inventoryItemId_warehouseId_locationId_status: {
          inventoryItemId: dto.inventoryItemId,
          warehouseId: dto.warehouseId,
          locationId: dto.locationId || '',
          status: 'AVAILABLE',
        },
      },
      create: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        locationId: dto.locationId,
        status: 'AVAILABLE',
        quantityOnHand: Math.max(0, delta),
        quantityAvailable: Math.max(0, delta),
      },
      update: {
        quantityOnHand: { increment: delta },
        quantityAvailable: { increment: delta },
      },
    });

    if (dto.type === 'RECEIPT') {
      await this.eventBus.publish(
        new StockReceivedEvent(dto.inventoryItemId, {
          inventoryItemId: dto.inventoryItemId,
          warehouseId: dto.warehouseId,
          quantity: dto.quantity,
          unitCost,
        }),
      );
    } else if (dto.type === 'ISSUE') {
      await this.eventBus.publish(
        new StockIssuedEvent(dto.inventoryItemId, {
          inventoryItemId: dto.inventoryItemId,
          warehouseId: dto.warehouseId,
          quantity: dto.quantity,
        }),
      );
    }

    return movement;
  }

  async getMovements(inventoryItemId?: string, warehouseId?: string) {
    const where: any = {};
    if (inventoryItemId) where.inventoryItemId = inventoryItemId;
    if (warehouseId) where.warehouseId = warehouseId;

    return this.prisma.stock_movements.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
