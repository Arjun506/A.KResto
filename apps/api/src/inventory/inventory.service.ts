import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { JwtUser } from '../common/types/jwt-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInventoryItemDto,
  DeductStockDto,
  UpdateInventoryItemDto,
} from './dto/inventory-item.dto';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderStatusDto,
} from './dto/purchase-order.dto';
import { SetMenuItemIngredientsDto } from './dto/menu-item-ingredient.dto';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

type InventoryWriteClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined) {
    return user?.role === 'SUPER_ADMIN';
  }

  private tenantId(user: JwtUser | undefined) {
    if (!user?.tenantId) {
      throw new ForbiddenException('Missing tenantId for tenant access');
    }

    return user.tenantId;
  }

  private tenantWhere(user: JwtUser | undefined) {
    if (this.isSuperAdmin(user) && !user?.tenantId) return {};
    return { tenantId: this.tenantId(user) };
  }

  async createItem(user: JwtUser | undefined, dto: CreateInventoryItemDto) {
    const tenantId = this.tenantId(user);
    await this.assertSupplier(user, dto.supplierId);

    return this.prisma.inventory_items.create({
      data: {
        tenantId,
        name: dto.name,
        sku: dto.sku,
        quantity: dto.quantity,
        unit: dto.unit,
        lowStockLevel: dto.lowStockLevel ?? 0,
        supplierId: dto.supplierId,
      },
    });
  }

  async getItems(user: JwtUser | undefined) {
    const items = await this.prisma.inventory_items.findMany({
      where: this.tenantWhere(user),
      orderBy: { name: 'asc' },
      include: { suppliers: true },
    });

    return items.map((item) => ({
      ...item,
      isLowStock: Number(item.quantity) <= Number(item.lowStockLevel),
    }));
  }

  async updateItem(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateInventoryItemDto,
  ) {
    await this.assertItem(user, id);
    await this.assertSupplier(user, dto.supplierId ?? undefined);

    return this.prisma.inventory_items.update({
      where: { id },
      data: dto,
    });
  }

  async deductStock(
    user: JwtUser | undefined,
    id: string,
    dto: DeductStockDto,
  ) {
    const item = await this.assertItem(user, id);
    const nextQuantity = Number(item.quantity) - dto.quantity;

    if (nextQuantity < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.inventory_items.update({
      where: { id },
      data: { quantity: nextQuantity },
    });
  }

  async deleteItem(user: JwtUser | undefined, id: string) {
    const deleted = await this.prisma.inventory_items.deleteMany({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!deleted.count) throw new NotFoundException('Inventory item not found');
    return { id };
  }

  async lowStockAlerts(user: JwtUser | undefined) {
    const items = await this.getItems(user);
    return items.filter((item) => item.isLowStock);
  }

  async createSupplier(user: JwtUser | undefined, dto: CreateSupplierDto) {
    return this.prisma.suppliers.create({
      data: {
        tenantId: this.tenantId(user),
        ...dto,
      },
    });
  }

  async getSuppliers(user: JwtUser | undefined) {
    return this.prisma.suppliers.findMany({
      where: this.tenantWhere(user),
      orderBy: { name: 'asc' },
    });
  }

  async updateSupplier(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateSupplierDto,
  ) {
    await this.assertSupplier(user, id);

    return this.prisma.suppliers.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSupplier(user: JwtUser | undefined, id: string) {
    const deleted = await this.prisma.suppliers.deleteMany({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!deleted.count) throw new NotFoundException('Supplier not found');
    return { id };
  }

  async createPurchaseOrder(
    user: JwtUser | undefined,
    dto: CreatePurchaseOrderDto,
  ) {
    const tenantId = this.tenantId(user);
    await this.assertSupplier(user, dto.supplierId);

    const totalAmount = dto.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.purchase_orders.create({
      data: {
        tenantId,
        supplierId: dto.supplierId,
        expectedDeliveryDate: dto.expectedDeliveryDate
          ? new Date(dto.expectedDeliveryDate)
          : undefined,
        notes: dto.notes,
        totalAmount,
        purchase_order_items: {
          create: dto.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { purchase_order_items: true, suppliers: true },
    });
  }

  async getPurchaseOrders(user: JwtUser | undefined) {
    return this.prisma.purchase_orders.findMany({
      where: this.tenantWhere(user),
      orderBy: { createdAt: 'desc' },
      include: { purchase_order_items: true, suppliers: true },
    });
  }

  async updatePurchaseOrderStatus(
    user: JwtUser | undefined,
    id: string,
    dto: UpdatePurchaseOrderStatusDto,
  ) {
    const order = await this.prisma.purchase_orders.findFirst({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!order) throw new NotFoundException('Purchase order not found');

    return this.prisma.purchase_orders.update({
      where: { id },
      data: { status: dto.status },
      include: { purchase_order_items: true, suppliers: true },
    });
  }

  async getMenuItemIngredients(user: JwtUser | undefined, menuItemId: string) {
    await this.assertMenuItem(user, menuItemId);

    return this.prisma.menu_item_ingredients.findMany({
      where: { menuItemId, ...this.tenantWhere(user) },
      include: { inventory_items: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async setMenuItemIngredients(
    user: JwtUser | undefined,
    menuItemId: string,
    dto: SetMenuItemIngredientsDto,
  ) {
    const tenantId = this.tenantId(user);
    await this.assertMenuItem(user, menuItemId);

    const inventoryIds = dto.ingredients.map((item) => item.inventoryItemId);
    if (inventoryIds.length > 0) {
      const inventoryItems = await this.prisma.inventory_items.findMany({
        where: {
          id: { in: inventoryIds },
          tenantId,
        },
        select: { id: true },
      });

      if (inventoryItems.length !== new Set(inventoryIds).size) {
        throw new BadRequestException(
          'One or more inventory items are invalid for this restaurant',
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.menu_item_ingredients.deleteMany({
        where: { menuItemId, tenantId },
      });

      if (dto.ingredients.length > 0) {
        await tx.menu_item_ingredients.createMany({
          data: dto.ingredients.map((ingredient) => ({
            tenantId,
            menuItemId,
            inventoryItemId: ingredient.inventoryItemId,
            quantity: ingredient.quantity,
          })),
        });
      }
    });

    return this.getMenuItemIngredients(user, menuItemId);
  }

  async getMovements(user: JwtUser | undefined) {
    return this.prisma.inventory_movements.findMany({
      where: this.tenantWhere(user),
      include: { inventory_items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async consumeForOrder(
    client: InventoryWriteClient,
    input: {
      tenantId: string;
      orderId: string;
      items: Array<{ id: string; menuItemId: string; quantity: number }>;
    },
  ): Promise<Array<{ inventoryItemId: string; quantity: number }>> {
    const menuItemIds = Array.from(
      new Set(input.items.map((item) => item.menuItemId)),
    );

    const ingredients = await client.menu_item_ingredients.findMany({
      where: {
        tenantId: input.tenantId,
        menuItemId: { in: menuItemIds },
      },
      include: { inventory_items: true },
    });

    if (ingredients.length === 0) return [];

    const orderItemByMenuId = new Map(
      input.items.map((item) => [item.menuItemId, item]),
    );
    const requiredByInventory = new Map<string, number>();
    const movementRows: Array<{
      inventoryItemId: string;
      orderItemId: string;
      quantity: number;
      menuItemId: string;
    }> = [];

    for (const ingredient of ingredients) {
      const orderItem = orderItemByMenuId.get(ingredient.menuItemId);
      if (!orderItem) continue;

      const required = this.roundQuantity(
        Number(ingredient.quantity) * orderItem.quantity,
      );
      const current = requiredByInventory.get(ingredient.inventoryItemId) ?? 0;
      requiredByInventory.set(
        ingredient.inventoryItemId,
        this.roundQuantity(current + required),
      );
      movementRows.push({
        inventoryItemId: ingredient.inventoryItemId,
        orderItemId: orderItem.id,
        quantity: required,
        menuItemId: ingredient.menuItemId,
      });
    }

    const inventoryItems = await client.inventory_items.findMany({
      where: {
        tenantId: input.tenantId,
        id: { in: Array.from(requiredByInventory.keys()) },
      },
      select: { id: true, name: true, quantity: true },
    });

    const inventoryById = new Map(
      inventoryItems.map((item) => [item.id, item]),
    );

    for (const [inventoryItemId, required] of requiredByInventory.entries()) {
      const item = inventoryById.get(inventoryItemId);
      if (!item) {
        throw new BadRequestException('Inventory recipe mapping is invalid');
      }

      if (Number(item.quantity) < required) {
        throw new BadRequestException(
          `Insufficient stock for ${item.name}. Required ${required}, available ${item.quantity}`,
        );
      }
    }

    for (const [inventoryItemId, quantity] of requiredByInventory.entries()) {
      await client.inventory_items.update({
        where: { id: inventoryItemId },
        data: { quantity: { decrement: quantity } },
      });
    }

    if (movementRows.length > 0) {
      await client.inventory_movements.createMany({
        data: movementRows.map((row) => ({
          tenantId: input.tenantId,
          inventoryItemId: row.inventoryItemId,
          orderId: input.orderId,
          orderItemId: row.orderItemId,
          type: 'SALE_CONSUMPTION',
          quantity: row.quantity,
          reason: `Order ${input.orderId} consumed recipe item ${row.menuItemId}`,
        })),
      });
    }

    return Array.from(requiredByInventory.entries()).map(
      ([inventoryItemId, quantity]) => ({ inventoryItemId, quantity }),
    );
  }

  private async assertItem(user: JwtUser | undefined, id: string) {
    const item = await this.prisma.inventory_items.findFirst({
      where: { id, ...this.tenantWhere(user) },
    });

    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  private async assertSupplier(user: JwtUser | undefined, supplierId?: string) {
    if (!supplierId) return;

    const supplier = await this.prisma.suppliers.findFirst({
      where: { id: supplierId, ...this.tenantWhere(user) },
    });

    if (!supplier) {
      throw new BadRequestException('Supplier is invalid for this restaurant');
    }
  }

  private async assertMenuItem(user: JwtUser | undefined, id: string) {
    const item = await this.prisma.menu_items.findFirst({
      where: { id, ...this.tenantWhere(user) },
      select: { id: true },
    });

    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  private roundQuantity(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
