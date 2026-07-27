import { Injectable } from '@nestjs/common';
import { BusinessRelationshipsRepository } from './business-relationships.repository';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BusinessRelationshipCreatedEvent } from '../../event-bus/events/business.events';

@Injectable()
export class BusinessRelationshipsService {
  constructor(
    private readonly repo: BusinessRelationshipsRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async createRelationship(
    sourceBusinessId: string,
    dto: CreateRelationshipDto,
  ) {
    const rel = await this.repo.create(sourceBusinessId, dto);

    await this.eventBus.publish(
      new BusinessRelationshipCreatedEvent(sourceBusinessId, {
        sourceBusinessId,
        targetBusinessId: dto.targetBusinessId,
        type: dto.type,
      }),
    );

    return rel;
  }

  async getRelationships(businessId: string) {
    return this.repo.getRelationships(businessId);
  }

  async removeRelationship(id: string) {
    return this.repo.softDelete(id);
  }
}
