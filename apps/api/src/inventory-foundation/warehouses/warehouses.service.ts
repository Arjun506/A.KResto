import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { WarehouseCreatedEvent } from '../../event-bus/events/inventory.events';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createWarehouse(dto: CreateWarehouseDto) {
    const warehouse = await this.prisma.warehouses.create({
      data: {
        tenantId: dto.tenantId,
        businessId: dto.businessId,
        code: dto.code,
        name: dto.name,
        type: dto.type || 'MAIN_WAREHOUSE',
        region: dto.region,
        zone: dto.zone,
        campus: dto.campus,
        building: dto.building,
        floor: dto.floor,
        room: dto.room,
        address: dto.address,
        city: dto.city,
        country: dto.country,
      },
    });

    await this.eventBus.publish(
      new WarehouseCreatedEvent(
        warehouse.id,
        {
          warehouseId: warehouse.id,
          code: warehouse.code,
          name: warehouse.name,
        },
        warehouse.tenantId || undefined,
      ),
    );

    return warehouse;
  }

  async getWarehouseById(id: string) {
    const warehouse = await this.prisma.warehouses.findFirst({
      where: { id, deletedAt: null },
      include: {
        storageLocations: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  async listWarehouses(tenantId?: string) {
    return this.prisma.warehouses.findMany({
      where: tenantId ? { tenantId, deletedAt: null } : { deletedAt: null },
    });
  }

  async softDeleteWarehouse(id: string) {
    return this.prisma.warehouses.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
