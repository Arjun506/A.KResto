import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from './tenant.repository';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { EventBusService } from '../event-bus/event-bus.service';
import { TenantCreatedEvent } from '../event-bus/events/system.events';

@Injectable()
export class TenantService {
  constructor(
    private readonly repo: TenantRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async createTenant(dto: CreateTenantDto) {
    const existing = await this.repo.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(
        `Tenant with slug ${dto.slug} already exists`,
      );
    }

    const tenant = await this.repo.createTenant(dto);

    await this.eventBus.publish(
      new TenantCreatedEvent(tenant.id, {
        tenantId: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      }),
    );

    return tenant;
  }

  async getTenantById(id: string) {
    const tenant = await this.repo.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async listTenants(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { items, total } = await this.repo.listTenants(skip, limit);
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async setFeatureFlag(
    tenantId: string,
    featureKey: string,
    isEnabled: boolean,
    config?: any,
  ) {
    await this.getTenantById(tenantId);
    return this.repo.setFeatureFlag(tenantId, featureKey, isEnabled, config);
  }
}
