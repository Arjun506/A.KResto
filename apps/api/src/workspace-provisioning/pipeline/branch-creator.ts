import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

@Injectable()
export class BranchCreator {
  createDefaultBranch(
    tx: Prisma.TransactionClient,
    input: { tenantId: string; location: string | null },
  ) {
    const { tenantId } = input;

    return tx.branch.create({
      data: {
        tenantId,
        name: 'Main Branch',
        code: 'MAIN',
        location: input.location ?? null,
        isActive: true,
      },
    });
  }
}
