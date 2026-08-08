import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async setBranchItemConfig(
    tenantId: string,
    branchId: string,
    menuItemId: string,
    isAvailable?: boolean,
    priceOverride?: number,
  ) {
    // Verify branch ownership
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    return this.prisma.menu_item_branch_configs.upsert({
      where: {
        branchId_menuItemId: { branchId, menuItemId },
      },
      create: {
        tenantId,
        branchId,
        menuItemId,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        priceOverride: priceOverride !== undefined ? priceOverride : null,
      },
      update: {
        ...(isAvailable !== undefined && { isAvailable }),
        ...(priceOverride !== undefined && { priceOverride }),
      },
    });
  }

  async getBranchMenuConfigs(tenantId: string, branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    return this.prisma.menu_item_branch_configs.findMany({
      where: { tenantId, branchId },
    });
  }
}
