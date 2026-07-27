import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransferDto } from './create-transfer.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { StockTransferredEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class StockTransfersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createTransfer(dto: CreateTransferDto) {
    const transfer = await this.prisma.stock_transfers.create({
      data: {
        transferNumber: dto.transferNumber,
        sourceWarehouseId: dto.sourceWarehouseId,
        targetWarehouseId: dto.targetWarehouseId,
        status: dto.status || 'PENDING',
      },
    });

    await this.eventBus.publish(
      new StockTransferredEvent(transfer.id, {
        sourceWarehouseId: dto.sourceWarehouseId,
        targetWarehouseId: dto.targetWarehouseId,
        inventoryItemId: 'BULK',
        quantity: 0,
      }),
    );

    return transfer;
  }

  async getTransfers() {
    return this.prisma.stock_transfers.findMany({
      include: {
        sourceWarehouse: { select: { id: true, code: true, name: true } },
        targetWarehouse: { select: { id: true, code: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
