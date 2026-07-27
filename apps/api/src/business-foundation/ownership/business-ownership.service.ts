import { Injectable } from '@nestjs/common';
import { BusinessOwnershipRepository } from './business-ownership.repository';
import { AssignOwnershipDto } from './dto/assign-owner.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BusinessOwnershipTransferredEvent } from '../../event-bus/events/business.events';

@Injectable()
export class BusinessOwnershipService {
  constructor(
    private readonly repo: BusinessOwnershipRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async assignOwnership(businessId: string, dto: AssignOwnershipDto) {
    const record = await this.repo.assignOwnership(businessId, dto);

    if (dto.role === 'OWNER') {
      await this.eventBus.publish(
        new BusinessOwnershipTransferredEvent(businessId, {
          businessId,
          newOwnerId: dto.userId,
        }),
      );
    }

    return record;
  }

  async getCurrentOwners(businessId: string) {
    return this.repo.getCurrentOwners(businessId);
  }

  async getOwnershipHistory(businessId: string) {
    return this.repo.getOwnershipHistory(businessId);
  }

  async unassignOwnership(businessId: string, userId: string) {
    return this.repo.unassignOwnership(businessId, userId);
  }
}
