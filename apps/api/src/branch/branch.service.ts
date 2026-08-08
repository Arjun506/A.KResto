import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from './branch.repository';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class BranchService {
  constructor(
    private readonly repo: BranchRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async createBranch(tenantId: string, dto: CreateBranchDto) {
    const branch = await this.repo.create(tenantId, dto);

    await this.eventBus.publish({
      eventName: 'branchCreated',
      aggregateId: branch.id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, branchId: branch.id, name: branch.name, code: branch.code },
    });

    return branch;
  }

  async listBranches(tenantId: string, filters?: { status?: string; industryType?: string }) {
    return this.repo.findAll(tenantId, filters);
  }

  async getBranchById(tenantId: string, id: string) {
    const branch = await this.repo.findById(tenantId, id);
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  async updateBranch(tenantId: string, id: string, dto: UpdateBranchDto) {
    await this.getBranchById(tenantId, id);
    await this.repo.update(tenantId, id, dto);
    const updated = await this.getBranchById(tenantId, id);

    await this.eventBus.publish({
      eventName: 'branchUpdated',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, branchId: id, changes: dto },
    });

    return updated;
  }

  async updateBranchStatus(tenantId: string, id: string, status: string) {
    const branch = await this.getBranchById(tenantId, id);
    const isActive = status.toUpperCase() === 'ACTIVE';
    await this.repo.update(tenantId, id, { status, isActive });

    await this.eventBus.publish({
      eventName: 'branchStatusChanged',
      aggregateId: id,
      tenantId,
      occurredOn: new Date(),
      payload: { tenantId, branchId: id, status, isActive },
    });

    return this.getBranchById(tenantId, id);
  }

  async findNearbyBranches(latitude: number, longitude: number, radiusKm?: number, industryType?: string) {
    return this.repo.findNearby(latitude, longitude, radiusKm, industryType);
  }
}
