import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { JwtUser } from '../common/types/jwt-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateMenuAvailabilityDto } from './dto/update-menu-availability.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined) {
    return user?.role === 'SUPER_ADMIN';
  }

  private restaurantId(user: JwtUser | undefined) {
    if (!user?.restaurantId) {
      throw new ForbiddenException('Missing restaurantId for tenant access');
    }

    return user.restaurantId;
  }

  private tenantWhere(user: JwtUser | undefined) {
    if (this.isSuperAdmin(user) && !user?.restaurantId) return {};
    return { restaurantId: this.restaurantId(user) };
  }

  async createCategory(user: JwtUser | undefined, dto: CreateCategoryDto) {
    const restaurantId = this.restaurantId(user);

    return this.prisma.categories.create({
      data: {
        restaurantId,
        name: dto.name,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getCategories(user: JwtUser | undefined) {
    return this.prisma.categories.findMany({
      where: this.tenantWhere(user),
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async updateCategory(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateCategoryDto,
  ) {
    const category = await this.prisma.categories.findFirst({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.categories.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(user: JwtUser | undefined, id: string) {
    const deleted = await this.prisma.categories.deleteMany({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!deleted.count) throw new NotFoundException('Category not found');
    return { id };
  }

  async createMenuItem(user: JwtUser | undefined, dto: CreateMenuItemDto) {
    const restaurantId = this.restaurantId(user);
    await this.assertCategory(user, dto.categoryId);

    return this.prisma.menu_items.create({
      data: {
        restaurantId,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isAvailable: dto.isAvailable ?? true,
        menu_item_variants: {
          create: (dto.variants ?? []).map((variant) => ({
            restaurantId,
            name: variant.name,
            priceDelta: variant.priceDelta,
          })),
        },
        menu_item_addons: {
          create: (dto.addons ?? []).map((addon) => ({
            restaurantId,
            name: addon.name,
            price: addon.price,
          })),
        },
      },
      include: this.menuInclude(),
    });
  }

  async getMenuItems(user: JwtUser | undefined) {
    return this.prisma.menu_items.findMany({
      where: this.tenantWhere(user),
      orderBy: { createdAt: 'desc' },
      include: this.menuInclude(),
    });
  }

  async getMenuItem(user: JwtUser | undefined, id: string) {
    const item = await this.prisma.menu_items.findFirst({
      where: { id, ...this.tenantWhere(user) },
      include: this.menuInclude(),
    });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async updateMenuItem(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateMenuItemDto,
  ) {
    await this.getMenuItem(user, id);
    await this.assertCategory(user, dto.categoryId);

    const { variants, addons, ...data } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (variants) {
        await tx.menu_item_variants.deleteMany({
          where: { menuItemId: id, ...this.tenantWhere(user) },
        });
      }

      if (addons) {
        await tx.menu_item_addons.deleteMany({
          where: { menuItemId: id, ...this.tenantWhere(user) },
        });
      }

      return tx.menu_items.update({
        where: { id },
        data: {
          ...data,
          menu_item_variants: variants
            ? {
                create: variants.map((variant) => ({
                  restaurantId: this.restaurantId(user),
                  name: variant.name,
                  priceDelta: variant.priceDelta,
                })),
              }
            : undefined,
          menu_item_addons: addons
            ? {
                create: addons.map((addon) => ({
                  restaurantId: this.restaurantId(user),
                  name: addon.name,
                  price: addon.price,
                })),
              }
            : undefined,
        },
        include: this.menuInclude(),
      });
    });
  }

  async updateAvailability(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateMenuAvailabilityDto,
  ) {
    await this.getMenuItem(user, id);

    return this.prisma.menu_items.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
      include: this.menuInclude(),
    });
  }

  async deleteMenuItem(user: JwtUser | undefined, id: string) {
    const deleted = await this.prisma.menu_items.deleteMany({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!deleted.count) throw new NotFoundException('Menu item not found');
    return { id };
  }

  private async assertCategory(user: JwtUser | undefined, categoryId?: string) {
    if (!categoryId) return;

    const category = await this.prisma.categories.findFirst({
      where: { id: categoryId, ...this.tenantWhere(user) },
    });

    if (!category) {
      throw new BadRequestException('Category is invalid for this restaurant');
    }
  }

  private menuInclude() {
    return {
      categories: true,
      menu_item_variants: true,
      menu_item_addons: true,
    } as const;
  }
}
