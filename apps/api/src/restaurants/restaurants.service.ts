import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PlanTier } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';
import type { CreateRestaurantDto } from './dto/create-restaurant.dto';
import type { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined): boolean {
    return user?.role === 'SUPER_ADMIN';
  }

  private requireTenanttenantId(user: JwtUser | undefined): string {
    if (!user?.tenantId)
      throw new ForbiddenException('Missing tenantId in token');
    return user.tenantId;
  }

  async listRestaurants(user: JwtUser | undefined) {
    if (this.isSuperAdmin(user)) {
      return this.prisma.tenant.findMany({
        include: { subscriptions: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    const tenanttenantId = this.requireTenanttenantId(user);

    return this.prisma.tenant.findMany({
      where: { id: tenanttenantId },
      include: { subscriptions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRestaurant(
    user: JwtUser | undefined,
    input: CreateRestaurantDto,
  ) {
    if (!this.isSuperAdmin(user)) {
      throw new ForbiddenException('Only SUPER_ADMIN can create restaurants');
    }

    const slug = input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-');

    const created = await this.prisma.tenant.create({
      data: {
        name: input.name,
        location: input.location,
        slug,
        isActive: input.isActive ?? true,
      },
    });

    const currentPeriodStart = new Date();
    const currentPeriodEnd = input.expiresAt
      ? new Date(input.expiresAt)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await this.prisma.subscriptions.create({
      data: {
        tenantId: created.id,
        planName: input.planName ?? PlanTier.PROFESSIONAL,
        status: 'ACTIVE',
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    return this.prisma.tenant.findUnique({
      where: { id: created.id },
      include: { subscriptions: true },
    });
  }

  async getRestaurant(user: JwtUser | undefined, id: string) {
    if (this.isSuperAdmin(user)) {
      const restaurant = await this.prisma.tenant.findUnique({
        where: { id },
        include: { subscriptions: true },
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      return restaurant;
    }

    const tenanttenantId = this.requireTenanttenantId(user);
    if (id !== tenanttenantId) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.prisma.tenant.findFirst({
      where: { id: tenanttenantId },
      include: { subscriptions: true },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async updateRestaurant(
    user: JwtUser | undefined,
    id: string,
    input: UpdateRestaurantDto,
  ) {
    if (!this.isSuperAdmin(user) && user?.tenantId !== id) {
      throw new ForbiddenException('Not allowed');
    }

    const existing = await this.prisma.tenant.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Restaurant not found');

    const slug =
      input.slug ??
      (input.name
        ? input.name.toLowerCase().replace(/\s+/g, '-')
        : existing.slug);

    await this.prisma.tenant.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.location !== undefined && { location: input.location }),
        ...(slug && { slug }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.timezone !== undefined && { timezone: input.timezone }),
        ...(input.currency !== undefined && { currency: input.currency }),
        ...(input.logo !== undefined && { logo: input.logo }),
        ...(input.settings !== undefined && { settings: input.settings }),
        ...(input.branding !== undefined && { branding: input.branding }),
      },
    });

    if (input.planName !== undefined || input.expiresAt !== undefined) {
      const activeSub = await this.prisma.subscriptions.findFirst({
        where: { tenantId: id },
      });

      if (activeSub) {
        await this.prisma.subscriptions.update({
          where: { id: activeSub.id },
          data: {
            ...(input.planName !== undefined && { planName: input.planName }),
            ...(input.expiresAt !== undefined && {
              currentPeriodEnd: new Date(input.expiresAt),
            }),
          },
        });
      } else {
        await this.prisma.subscriptions.create({
          data: {
            tenantId: id,
            planName: input.planName ?? PlanTier.PROFESSIONAL,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: input.expiresAt
              ? new Date(input.expiresAt)
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return this.prisma.tenant.findUnique({
      where: { id },
      include: { subscriptions: true },
    });
  }

  async deleteRestaurant(user: JwtUser | undefined, id: string) {
    if (!this.isSuperAdmin(user) && user?.tenantId !== id) {
      throw new ForbiddenException('Not allowed');
    }

    try {
      await this.prisma.tenant.delete({ where: { id } });
      return { id };
    } catch {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
