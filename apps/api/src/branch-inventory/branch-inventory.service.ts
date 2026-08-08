import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class BranchInventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async getBranchInventory(tenantId: string, branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    return this.prisma.inventory_items.findMany({
      where: { tenantId, branchId },
      orderBy: { name: 'asc' },
    });
  }

  async getLowStockByBranch(tenantId: string, branchId: string) {
    const items = await this.getBranchInventory(tenantId, branchId);
    return items.filter((item) => Number(item.quantity) <= Number(item.lowStockLevel));
  }

  async createTransfer(tenantId: string, userId: string, dto: CreateTransferDto) {
    if (dto.sourceBranchId === dto.destinationBranchId) {
      throw new BadRequestException('Source and destination branches cannot be the same');
    }

    const sourceBranch = await this.prisma.branch.findFirst({
      where: { id: dto.sourceBranchId, tenantId },
    });
    const destBranch = await this.prisma.branch.findFirst({
      where: { id: dto.destinationBranchId, tenantId },
    });

    if (!sourceBranch || !destBranch) {
      throw new NotFoundException('Invalid source or destination branch for tenant');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Transfer must contain at least one inventory item');
    }

    const refNumber = `TRF-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const transfer = await this.prisma.$transaction(async (tx) => {
      const itemsData: { inventoryItemId: string; itemName: string; quantity: number; unit: string }[] = [];
      for (const itemDto of dto.items) {
        const invItem = await tx.inventory_items.findFirst({
          where: { id: itemDto.inventoryItemId, tenantId, branchId: dto.sourceBranchId },
        });
        if (!invItem) {
          throw new NotFoundException(`Inventory item ${itemDto.inventoryItemId} not found at source branch`);
        }
        itemsData.push({
          inventoryItemId: invItem.id,
          itemName: invItem.name,
          quantity: itemDto.quantity,
          unit: invItem.unit,
        });
      }

      return tx.inventory_transfers.create({
        data: {
          tenantId,
          referenceNumber: refNumber,
          sourceBranchId: dto.sourceBranchId,
          destinationBranchId: dto.destinationBranchId,
          status: 'REQUESTED',
          notes: dto.notes,
          requestedById: userId,
          requestedAt: new Date(),
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
          sourceBranch: true,
          destinationBranch: true,
        },
      });
    });

    await this.eventBus.publish({
      eventName: 'inventoryTransferCreated',
      aggregateId: transfer.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, transferId: transfer.id, referenceNumber: refNumber },
    });

    return transfer;
  }

  async approveTransfer(tenantId: string, userId: string, id: string) {
    const transfer = await this.prisma.inventory_transfers.findFirst({
      where: { id, tenantId },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }
    if (transfer.status !== 'REQUESTED' && transfer.status !== 'DRAFT') {
      throw new BadRequestException(`Cannot approve transfer in status ${transfer.status}`);
    }

    const updated = await this.prisma.inventory_transfers.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: userId,
        approvedAt: new Date(),
      },
      include: { items: true },
    });

    await this.eventBus.publish({
      eventName: 'inventoryTransferApproved',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, transferId: id },
    });

    return updated;
  }

  async shipTransfer(tenantId: string, userId: string, id: string) {
    const transfer = await this.prisma.inventory_transfers.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }
    if (transfer.status !== 'APPROVED' && transfer.status !== 'REQUESTED') {
      throw new BadRequestException(`Cannot ship transfer in status ${transfer.status}`);
    }

    // Execute PostgreSQL Transaction: Deduct source branch inventory
    const shipped = await this.prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        const sourceItem = await tx.inventory_items.findUnique({
          where: { id: item.inventoryItemId },
        });

        if (!sourceItem) {
          throw new NotFoundException(`Item ${item.itemName} not found at source branch`);
        }

        const currentQty = Number(sourceItem.quantity);
        const reqQty = Number(item.quantity);

        if (currentQty < reqQty) {
          throw new BadRequestException(
            `Insufficient stock for ${sourceItem.name} at source branch. Required: ${reqQty} ${sourceItem.unit}, Available: ${currentQty} ${sourceItem.unit}`,
          );
        }

        const newSourceQty = currentQty - reqQty;

        await tx.inventory_items.update({
          where: { id: sourceItem.id },
          data: { quantity: newSourceQty },
        });

        await tx.inventory_movements.create({
          data: {
            tenantId,
            inventoryItemId: sourceItem.id,
            type: 'TRANSFER_OUT',
            quantity: reqQty,
            unit: sourceItem.unit,
            beforeQuantity: currentQty,
            afterQuantity: newSourceQty,
            referenceType: 'INVENTORY_TRANSFER',
            referenceId: transfer.id,
            reason: `Shipped inter-branch transfer ${transfer.referenceNumber} to branch ${transfer.destinationBranchId}`,
          },
        });
      }

      return tx.inventory_transfers.update({
        where: { id },
        data: {
          status: 'IN_TRANSIT',
          shippedById: userId,
          shippedAt: new Date(),
        },
        include: { items: true },
      });
    });

    await this.eventBus.publish({
      eventName: 'inventoryTransferShipped',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, transferId: id },
    });

    return shipped;
  }

  async receiveTransfer(tenantId: string, userId: string, id: string) {
    const transfer = await this.prisma.inventory_transfers.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }

    // Idempotency & Safety rejection
    if (transfer.status !== 'IN_TRANSIT') {
      throw new BadRequestException(
        `Cannot receive transfer in status '${transfer.status}'. Only IN_TRANSIT transfers can be received.`,
      );
    }

    // Execute PostgreSQL Transaction: Increase destination branch inventory
    const received = await this.prisma.$transaction(async (tx) => {
      for (const item of transfer.items) {
        const reqQty = Number(item.quantity);

        // Find existing item at destination branch by name
        let destItem = await tx.inventory_items.findFirst({
          where: {
            tenantId,
            branchId: transfer.destinationBranchId,
            name: item.itemName,
          },
        });

        let beforeQty = 0;
        let afterQty = reqQty;

        if (destItem) {
          beforeQty = Number(destItem.quantity);
          afterQty = beforeQty + reqQty;
          await tx.inventory_items.update({
            where: { id: destItem.id },
            data: { quantity: afterQty },
          });
        } else {
          // Fetch source item details for SKU, unit, category
          const sourceItem = await tx.inventory_items.findUnique({
            where: { id: item.inventoryItemId },
          });

          destItem = await tx.inventory_items.create({
            data: {
              tenantId,
              branchId: transfer.destinationBranchId,
              name: item.itemName,
              unit: item.unit,
              quantity: reqQty,
              sku: sourceItem?.sku || null,
              category: sourceItem?.category || null,
              costPerUnit: sourceItem?.costPerUnit || 0,
            },
          });
        }

        await tx.inventory_movements.create({
          data: {
            tenantId,
            inventoryItemId: destItem.id,
            type: 'TRANSFER_IN',
            quantity: reqQty,
            unit: item.unit,
            beforeQuantity: beforeQty,
            afterQuantity: afterQty,
            referenceType: 'INVENTORY_TRANSFER',
            referenceId: transfer.id,
            reason: `Received inter-branch transfer ${transfer.referenceNumber} from branch ${transfer.sourceBranchId}`,
          },
        });
      }

      return tx.inventory_transfers.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          receivedById: userId,
          receivedAt: new Date(),
        },
        include: { items: true },
      });
    });

    await this.eventBus.publish({
      eventName: 'inventoryTransferReceived',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, transferId: id },
    });

    return received;
  }

  async cancelTransfer(tenantId: string, userId: string, id: string) {
    const transfer = await this.prisma.inventory_transfers.findFirst({
      where: { id, tenantId },
      include: { items: true },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }
    if (transfer.status === 'RECEIVED' || transfer.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot cancel transfer in status ${transfer.status}`);
    }

    const cancelled = await this.prisma.$transaction(async (tx) => {
      // If was IN_TRANSIT, restore stock to source branch
      if (transfer.status === 'IN_TRANSIT') {
        for (const item of transfer.items) {
          const sourceItem = await tx.inventory_items.findUnique({
            where: { id: item.inventoryItemId },
          });

          if (sourceItem) {
            const currentQty = Number(sourceItem.quantity);
            const reqQty = Number(item.quantity);
            const restoredQty = currentQty + reqQty;

            await tx.inventory_items.update({
              where: { id: sourceItem.id },
              data: { quantity: restoredQty },
            });

            await tx.inventory_movements.create({
              data: {
                tenantId,
                inventoryItemId: sourceItem.id,
                type: 'ADJUSTMENT',
                quantity: reqQty,
                unit: sourceItem.unit,
                beforeQuantity: currentQty,
                afterQuantity: restoredQty,
                referenceType: 'INVENTORY_TRANSFER_CANCELLED',
                referenceId: transfer.id,
                reason: `Restored inventory from cancelled transfer ${transfer.referenceNumber}`,
              },
            });
          }
        }
      }

      return tx.inventory_transfers.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: { items: true },
      });
    });

    await this.eventBus.publish({
      eventName: 'inventoryTransferCancelled',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, transferId: id },
    });

    return cancelled;
  }

  async listTransfers(tenantId: string, branchId?: string, status?: string) {
    const where: any = { tenantId };
    if (status) where.status = status;
    if (branchId) {
      where.OR = [
        { sourceBranchId: branchId },
        { destinationBranchId: branchId },
      ];
    }

    return this.prisma.inventory_transfers.findMany({
      where,
      include: {
        items: true,
        sourceBranch: true,
        destinationBranch: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransferById(tenantId: string, id: string) {
    const transfer = await this.prisma.inventory_transfers.findFirst({
      where: { id, tenantId },
      include: {
        items: true,
        sourceBranch: true,
        destinationBranch: true,
      },
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer ${id} not found`);
    }
    return transfer;
  }
}
