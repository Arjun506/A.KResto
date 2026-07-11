import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import type { Prisma } from '@prisma/client';
import type { CreateWorkspaceDto } from '../../business/dto/create-workspace.dto';

@Injectable()
export class OwnerCreator {
  async createOwner(
    tx: Prisma.TransactionClient,
    input: { tenantId: string; dto: CreateWorkspaceDto },
  ) {
    const { tenantId, dto } = input;
    const hashedPassword = await bcrypt.hash(dto.ownerPassword, 10);

    return tx.users.create({
      data: {
        name: dto.ownerName,
        email: dto.ownerEmail,
        passwordHash: hashedPassword,
        role: UserRole.RESTAURANT_OWNER,
        restaurantId: tenantId,
      },
    });
  }
}
