import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CustomerRegistryRepository } from './customer-registry.repository';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { CustomerStatus, CustomerLifecycleStage } from '@prisma/client';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import {
  CustomerRegisteredEvent,
  CustomerStatusChangedEvent,
  CustomerLifecycleStageChangedEvent,
  CustomerMergedEvent,
  CustomerArchivedEvent,
  CustomerReactivatedEvent,
  CustomerDeletedEvent,
} from '../../event-bus/events/customer.events';

@Injectable()
export class CustomerRegistryService {
  constructor(
    private readonly repo: CustomerRegistryRepository,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async registerCustomer(dto: RegisterCustomerDto, actorId?: string) {
    const duplicates = await this.repo.findDuplicates(
      dto.email,
      dto.phone,
      dto.tenantId,
    );
    if (duplicates.length > 0) {
      // Duplicates detected, proceed with registration while logging warning
    }

    const customer = await this.repo.create(dto, actorId);

    await this.repo.recordTimeline(
      customer.id,
      'CUSTOMER_REGISTERED',
      `Customer record ${customer.customerCode} created`,
      actorId,
    );

    await this.eventBus.publish(
      new CustomerRegisteredEvent(
        customer.id,
        {
          customerId: customer.id,
          customerCode: customer.customerCode || undefined,
          identityType: customer.identityType,
        },
        customer.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: customer.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'CUSTOMER',
      entityId: customer.id,
      action: 'REGISTER',
      changes: [`Created customer ${customer.customerCode}`],
    });

    return customer;
  }

  async getCustomerById(id: string) {
    const customer = await this.repo.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async updateStatus(id: string, newStatus: CustomerStatus, actorId?: string) {
    const customer = await this.getCustomerById(id);
    const previousStatus = customer.status;

    const updated = await this.repo.updateStatus(id, newStatus, actorId);

    await this.repo.recordTimeline(
      id,
      'STATUS_CHANGED',
      `Status changed from ${previousStatus} to ${newStatus}`,
      actorId,
    );

    await this.eventBus.publish(
      new CustomerStatusChangedEvent(
        id,
        { customerId: id, previousStatus, newStatus },
        updated.tenantId || undefined,
      ),
    );

    if (newStatus === CustomerStatus.ARCHIVED) {
      await this.eventBus.publish(
        new CustomerArchivedEvent(
          id,
          { customerId: id },
          updated.tenantId || undefined,
        ),
      );
    } else if (
      previousStatus === CustomerStatus.SUSPENDED &&
      newStatus === CustomerStatus.ACTIVE
    ) {
      await this.eventBus.publish(
        new CustomerReactivatedEvent(
          id,
          { customerId: id },
          updated.tenantId || undefined,
        ),
      );
    }

    return updated;
  }

  async updateLifecycleStage(
    id: string,
    newStage: CustomerLifecycleStage,
    actorId?: string,
  ) {
    const customer = await this.getCustomerById(id);
    const previousStage = customer.lifecycleStage;

    const updated = await this.repo.updateLifecycleStage(id, newStage, actorId);

    await this.repo.recordTimeline(
      id,
      'LIFECYCLE_CHANGED',
      `Lifecycle stage changed from ${previousStage} to ${newStage}`,
      actorId,
    );

    await this.eventBus.publish(
      new CustomerLifecycleStageChangedEvent(
        id,
        { customerId: id, previousStage, newStage },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async mergeCustomers(
    sourceCustomerId: string,
    targetCustomerId: string,
    actorId?: string,
    reason?: string,
  ) {
    const source = await this.getCustomerById(sourceCustomerId);
    const target = await this.getCustomerById(targetCustomerId);

    const merged = await this.repo.mergeCustomers(
      sourceCustomerId,
      targetCustomerId,
      actorId,
      reason,
    );

    await this.repo.recordTimeline(
      targetCustomerId,
      'CUSTOMER_MERGED',
      `Merged customer ${source.customerCode} into ${target.customerCode}`,
      actorId,
    );

    await this.eventBus.publish(
      new CustomerMergedEvent(
        sourceCustomerId,
        { sourceCustomerId, targetCustomerId },
        target.tenantId || undefined,
      ),
    );

    return merged;
  }

  async softDeleteCustomer(id: string, actorId?: string) {
    const customer = await this.getCustomerById(id);
    await this.repo.softDelete(id, actorId);

    await this.repo.recordTimeline(
      id,
      'CUSTOMER_DELETED',
      `Customer ${customer.customerCode} soft deleted`,
      actorId,
    );

    await this.eventBus.publish(
      new CustomerDeletedEvent(
        id,
        { customerId: id },
        customer.tenantId || undefined,
      ),
    );

    return { success: true, message: `Customer ${id} soft deleted` };
  }

  async listCustomers(tenantId?: string, page: number = 1, limit: number = 20) {
    const { items, total } = await this.repo.list(tenantId, page, limit);
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async detectDuplicates(email?: string, phone?: string, tenantId?: string) {
    return this.repo.findDuplicates(email, phone, tenantId);
  }
}
