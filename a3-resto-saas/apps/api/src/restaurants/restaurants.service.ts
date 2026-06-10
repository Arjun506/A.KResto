import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined): boolean {
    return user?.role === 'SUPER_ADMIN';
  }

  private requireTenantRestaurantId(user: JwtUser | undefined): string {
    if (!user?.restaurantId)
      throw new ForbiddenException('Missing restaurantId in token');
    return user.restaurantId;
  }

  async listRestaurants(user: JwtUser | undefined) {
    if (this.isSuperAdmin(user)) {
      return this.prisma.restaurants.findMany({
        include: { subscriptions: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    const tenantRestaurantId = this.requireTenantRestaurantId(user);

    return this.prisma.restaurants.findMany({
      where: { id: tenantRestaurantId },
      include: { subscriptions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRestaurant(
    user: JwtUser | undefined,
    input: {
      name: string;
      location?: string;
      slug?: string;
      isActive?: boolean;
      planName?: string;
      expiresAt?: string;
    },
  ) {
    if (!this.isSuperAdmin(user)) {
      throw new ForbiddenException('Only SUPER_ADMIN can create restaurants');
    }

    const slug = input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-');

    const created = await this.prisma.restaurants.create({
      data: {
        name: input.name,
        location: input.location,
        slug,
        isActive: input.isActive ?? true,
      },
    });

    const currentPeriodStart = new Date();
    const currentPeriodEnd = input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year

    await this.prisma.subscriptions.create({
      data: {
        restaurantId: created.id,
        planName: input.planName ?? 'Pro',
        status: 'ACTIVE',
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    return this.prisma.restaurants.findUnique({
      where: { id: created.id },
      include: { subscriptions: true },
    });
  }

  async getRestaurant(user: JwtUser | undefined, id: string) {
    if (this.isSuperAdmin(user)) {
      const restaurant = await this.prisma.restaurants.findUnique({
        where: { id },
        include: { subscriptions: true },
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      return restaurant;
    }

    const tenantRestaurantId = this.requireTenantRestaurantId(user);
    if (id !== tenantRestaurantId) {
      throw new NotFoundException('Restaurant not found');
    }

    const restaurant = await this.prisma.restaurants.findFirst({
      where: { id: tenantRestaurantId },
      include: { subscriptions: true },
    });

    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async updateRestaurant(
    user: JwtUser | undefined,
    id: string,
    input: {
      name?: string;
      location?: string;
      slug?: string;
      isActive?: boolean;
      planName?: string;
      expiresAt?: string;
    },
  ) {
    if (!this.isSuperAdmin(user) && user?.restaurantId !== id) {
      throw new ForbiddenException('Not allowed');
    }

    const existing = await this.prisma.restaurants.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Restaurant not found');

    const slug =
      input.slug ??
      (input.name
        ? input.name.toLowerCase().replace(/\s+/g, '-')
        : existing.slug);

    await this.prisma.restaurants.update({
      where: { id },
      data: {
        name: input.name,
        location: input.location,
        slug,
        isActive: input.isActive,
      },
    });

    if (input.planName || input.expiresAt) {
      const activeSub = await this.prisma.subscriptions.findFirst({
        where: { restaurantId: id },
      });

      if (activeSub) {
        await this.prisma.subscriptions.update({
          where: { id: activeSub.id },
          data: {
            planName: input.planName,
            currentPeriodEnd: input.expiresAt ? new Date(input.expiresAt) : undefined,
          },
        });
      } else {
        await this.prisma.subscriptions.create({
          data: {
            restaurantId: id,
            planName: input.planName ?? 'Pro',
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: input.expiresAt ? new Date(input.expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    return this.prisma.restaurants.findUnique({
      where: { id },
      include: { subscriptions: true },
    });
  }

  async deleteRestaurant(user: JwtUser | undefined, id: string) {
    if (!this.isSuperAdmin(user) && user?.restaurantId !== id) {
      throw new ForbiddenException('Not allowed');
    }

    try {
      await this.prisma.restaurants.delete({ where: { id } });
      return { id };
    } catch {
      throw new NotFoundException('Restaurant not found');
    }
  }
}
