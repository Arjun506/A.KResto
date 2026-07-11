import { BadRequestException, Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import type { CreateWorkspaceDto } from '../../business/dto/create-workspace.dto';

@Injectable()
export class WorkspaceCreator {
  async createWorkspace(
    tx: Prisma.TransactionClient,
    input: {
      dto: CreateWorkspaceDto;
      slug: string;
      workspaceSettings: Prisma.InputJsonObject;
    },
  ) {
    const { dto, slug, workspaceSettings } = input;

    // Duplicate checks are part of the original BusinessService.createWorkspace

    // transaction behavior; they must be executed inside the transaction.
    const duplicateName = await tx.tenant.findFirst({
      where: { name: { equals: dto.businessName, mode: 'insensitive' } },
    });
    if (duplicateName) {
      throw new BadRequestException('Business name is already registered');
    }

    const duplicateEmail = await tx.users.findUnique({
      where: { email: dto.ownerEmail },
    });
    if (duplicateEmail) {
      throw new BadRequestException('Email already registered');
    }

    // Create workspace (tenant)
    const tenant = await tx.tenant.create({
      data: {
        name: dto.businessName,
        slug,
        location: dto.location ?? null,
        address: dto.address ?? null,
        currency: dto.currency ?? 'USD',
        timezone: dto.timezone ?? 'UTC',
        language: dto.language ?? 'en',
        industry: dto.industry,
        status: 'ACTIVE',
        settings: workspaceSettings,
      },
    });

    return tenant;
  }
}
