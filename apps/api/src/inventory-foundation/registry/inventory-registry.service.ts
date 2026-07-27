import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRegistryRepository } from './inventory-registry.repository';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { InventoryCreatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class InventoryRegistryService {
  constructor(
    private readonly repo: InventoryRegistryRepository,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async createInventoryItem(dto: CreateInventoryItemDto, actorId?: string) {
    const item = await this.repo.create(dto);

    await this.repo.recordTimeline(
      item.id,
      'INVENTORY_ITEM_CREATED',
      `Inventory item ${item.name} (${item.sku}) registered`,
      actorId,
    );

    await this.eventBus.publish(
      new InventoryCreatedEvent(
        item.id,
        { inventoryItemId: item.id, sku: item.sku, name: item.name },
        item.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: item.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'INVENTORY_ITEM',
      entityId: item.id,
      action: 'CREATE',
      changes: [`Registered inventory item ${item.name} (${item.sku})`],
    });

    return item;
  }

  async getInventoryItemById(id: string) {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async listInventoryItems(
    tenantId?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const { items, total } = await this.repo.list(tenantId, page, limit);
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async softDeleteInventoryItem(id: string, actorId?: string) {
    const item = await this.getInventoryItemById(id);
    await this.repo.softDelete(id);

    await this.repo.recordTimeline(
      id,
      'INVENTORY_ITEM_DELETED',
      `Inventory item ${item.sku} soft deleted`,
      actorId,
    );

    return { success: true, message: `Inventory item ${id} soft deleted` };
  }
}
