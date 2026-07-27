import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRestaurantMenuItemDto } from './dto/create-menu-item.dto';
import { CreateRestaurantModifierDto } from './dto/create-modifier.dto';
import { CreateRestaurantTaxProfileDto } from './dto/create-tax-profile.dto';

@Injectable()
export class RestaurantCoreService {
  constructor(private readonly prisma: PrismaService) {}

  // Consume ProductFoundation to register dishes
  async createMenuItem(tenantId: string, dto: CreateRestaurantMenuItemDto) {
    const code = `dish-${Date.now()}`;
    return this.prisma.products.create({
      data: {
        tenantId,
        sku: code,
        slug: code,
        name: dto.name,
        description: dto.description,
        status: 'ACTIVE',
        metadata: {
          isMenuItem: true,
          price: dto.price,
          ...dto.metadata,
        },
      },
    });
  }

  // Consume ProductFoundation to associate modifier groups
  async createModifierOption(
    tenantId: string,
    dto: CreateRestaurantModifierDto,
  ) {
    const code = `mod-${Date.now()}`;
    return this.prisma.products.create({
      data: {
        tenantId,
        sku: code,
        slug: code,
        name: dto.name,
        status: 'ACTIVE',
        metadata: {
          isModifierOption: true,
          price: dto.price,
          groupCode: dto.groupCode || 'GENERAL',
        },
      },
    });
  }

  // Configure recipes linking menu dishes to inventory master items
  async configureRecipe(
    tenantId: string,
    dishProductId: string,
    recipeIngredients: { inventoryItemId: string; quantity: number }[],
  ) {
    // Audit link recipe composition properties in metadata updates
    return this.prisma.products.update({
      where: { id: dishProductId },
      data: {
        metadata: {
          recipe: recipeIngredients,
        },
      },
    });
  }

  // Tax and Service charges settings profiles
  async createTaxProfile(tenantId: string, dto: CreateRestaurantTaxProfileDto) {
    return {
      tenantId,
      code: dto.code,
      rate: dto.rate,
      status: 'ACTIVE',
    };
  }

  async configureServiceCharge(tenantId: string, label: string, rate: number) {
    return {
      tenantId,
      label,
      rate,
      status: 'ACTIVE',
    };
  }

  async configurePrinterProfile(
    tenantId: string,
    name: string,
    ipAddress: string,
  ) {
    return {
      tenantId,
      name,
      ipAddress,
      status: 'ONLINE',
    };
  }
}
