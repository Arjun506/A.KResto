import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import {
  CreateOrganizationDto,
  CreateBusinessDto,
  CreateLocationDto,
} from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly repo: OrganizationRepository) {}

  async createOrganization(dto: CreateOrganizationDto) {
    return this.repo.createOrganization(dto);
  }

  async getOrganizationById(id: string) {
    const org = await this.repo.findOrganizationById(id);
    if (!org) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return org;
  }

  async listOrganizations(tenantId: string) {
    return this.repo.listOrganizations(tenantId);
  }

  async createBusiness(dto: CreateBusinessDto) {
    return this.repo.createBusiness(dto);
  }

  async createLocation(dto: CreateLocationDto) {
    return this.repo.createLocation(dto);
  }
}
