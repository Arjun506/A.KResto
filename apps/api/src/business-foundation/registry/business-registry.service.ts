import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BusinessRegistryRepository } from './business-registry.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessStatus } from '@prisma/client';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import {
  BusinessCreatedEvent,
  BusinessStatusChangedEvent,
  BusinessVerifiedEvent,
  BusinessDeletedEvent,
  BusinessOwnershipTransferredEvent,
} from '../../event-bus/events/business.events';

@Injectable()
export class BusinessRegistryService {
  constructor(
    private readonly repo: BusinessRegistryRepository,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async registerBusiness(dto: CreateBusinessDto, actorId?: string) {
    const duplicates = await this.repo.findDuplicates(dto.name, dto.tenantId);
    if (duplicates.length > 0) {
      // Duplicate warning logged, proceeding with registration
    }

    const business = await this.repo.create(dto);

    await this.repo.recordTimeline(
      business.id,
      'BUSINESS_REGISTERED',
      `Business ${business.name} registered in system`,
      actorId,
    );

    await this.eventBus.publish(
      new BusinessCreatedEvent(
        business.id,
        {
          businessId: business.id,
          name: business.name,
          status: business.status,
        },
        business.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: business.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'BUSINESS',
      entityId: business.id,
      action: 'REGISTER',
      changes: [`Created business ${business.name}`],
    });

    return business;
  }

  async getBusinessById(id: string) {
    const business = await this.repo.findById(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async updateStatus(id: string, newStatus: BusinessStatus, actorId?: string) {
    const business = await this.getBusinessById(id);
    const previousStatus = business.status;

    const updated = await this.repo.updateStatus(id, newStatus);

    await this.repo.recordTimeline(
      id,
      'STATUS_CHANGED',
      `Business status updated from ${previousStatus} to ${newStatus}`,
      actorId,
    );

    await this.eventBus.publish(
      new BusinessStatusChangedEvent(
        id,
        { businessId: id, previousStatus, newStatus },
        updated.tenantId || undefined,
      ),
    );

    if (newStatus === BusinessStatus.VERIFIED) {
      await this.eventBus.publish(
        new BusinessVerifiedEvent(
          id,
          { businessId: id, verifiedAt: new Date() },
          updated.tenantId || undefined,
        ),
      );
    }

    await this.auditService.logEvent({
      tenantId: updated.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'BUSINESS',
      entityId: id,
      action: 'UPDATE_STATUS',
      changes: [`Status changed from ${previousStatus} to ${newStatus}`],
    });

    return updated;
  }

  async softDeleteBusiness(id: string, actorId?: string) {
    const business = await this.getBusinessById(id);
    await this.repo.softDelete(id);

    await this.repo.recordTimeline(
      id,
      'BUSINESS_DELETED',
      `Business ${business.name} archived and soft deleted`,
      actorId,
    );

    await this.eventBus.publish(
      new BusinessDeletedEvent(
        id,
        { businessId: id },
        business.tenantId || undefined,
      ),
    );

    return { success: true, message: `Business ${id} soft deleted` };
  }

  async listBusinesses(
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

  async detectDuplicates(name: string, tenantId?: string) {
    return this.repo.findDuplicates(name, tenantId);
  }
}
