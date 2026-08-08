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
  AdjustStockDto,
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
import { convertUnit, normalizeUnit } from './unit-converter';

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

    const initialQuantity = dto.quantity ?? 0;
    const unit = normalizeUnit(dto.unit);

    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventory_items.create({
        data: {
          tenantId,
          name: dto.name,
          sku: dto.sku,
          category: dto.category,
          quantity: initialQuantity,
          unit,
          lowStockLevel: dto.lowStockLevel ?? 0,
          reorderLevel: dto.reorderLevel ?? dto.lowStockLevel ?? 0,
          costPerUnit: dto.costPerUnit ?? 0,
          supplierId: dto.supplierId,
          isActive: dto.isActive ?? true,
        },
      });

      if (initialQuantity > 0) {
        await tx.inventory_movements.create({
          data: {
            tenantId,
            inventoryItemId: item.id,
            type: 'OPENING_BALANCE',
            quantity: initialQuantity,
            unit,
            beforeQuantity: 0,
            afterQuantity: initialQuantity,
            referenceType: 'INITIAL_STOCK',
            reason: 'Initial stock on creation',
            createdBy: user?.id,
          },
        });
      }

      return item;
    });
  }

  async getItems(user: JwtUser | undefined) {
    const items = await this.prisma.inventory_items.findMany({
      where: this.tenantWhere(user),
      orderBy: { name: 'asc' },
      include: { suppliers: true },
    });

    return items.map((item) => {
      const qty = Number(item.quantity);
      const lowLevel = Number(item.lowStockLevel);
      const reorderLvl = Number(item.reorderLevel);

      return {
        ...item,
        isLowStock: qty <= Math.max(lowLevel, reorderLvl) && qty > 0,
        isOutOfStock: qty <= 0,
      };
    });
  }

  async updateItem(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateInventoryItemDto,
  ) {
    await this.assertItem(user, id);
    await this.assertSupplier(user, dto.supplierId ?? undefined);

    const dataToUpdate: Prisma.inventory_itemsUpdateInput = { ...dto };
    if (dto.unit) {
      dataToUpdate.unit = normalizeUnit(dto.unit);
    }

    return this.prisma.inventory_items.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async adjustStock(
    user: JwtUser | undefined,
    id: string,
    dto: AdjustStockDto,
  ) {
    const item = await this.assertItem(user, id);
    const beforeQuantity = Number(item.quantity);
    const changeQuantity = dto.changeQuantity;

    if (changeQuantity < 0 && !dto.reason) {
      throw new BadRequestException('Reason is required for negative stock adjustments');
    }

    const afterQuantity = this.roundQuantity(beforeQuantity + changeQuantity);
    if (afterQuantity < 0) {
      throw new BadRequestException(
        `Insufficient stock for ${item.name}. Available: ${beforeQuantity}, Requested deduction: ${Math.abs(changeQuantity)}`,
      );
    }

    const movementType =
      dto.type ||
      (changeQuantity < 0 ? 'WASTAGE' : changeQuantity > 0 ? 'MANUAL_ADJUSTMENT' : 'STOCK_COUNT_CORRECTION');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.inventory_items.update({
        where: { id },
        data: { quantity: afterQuantity },
      });

      await tx.inventory_movements.create({
        data: {
          tenantId: item.tenantId,
          inventoryItemId: item.id,
          type: movementType,
          quantity: Math.abs(changeQuantity),
          unit: item.unit,
          beforeQuantity,
          afterQuantity,
          referenceType: 'MANUAL_ADJUSTMENT',
          reason: dto.reason || `Stock adjusted by ${changeQuantity} ${item.unit}`,
          createdBy: user?.id,
        },
      });

      return updated;
    });
  }

  async deductStock(
    user: JwtUser | undefined,
    id: string,
    dto: DeductStockDto,
  ) {
    return this.adjustStock(user, id, {
      changeQuantity: -dto.quantity,
      type: 'WASTAGE',
      reason: dto.reason || 'Manual deduction',
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
    return items.filter((item) => item.isLowStock || item.isOutOfStock);
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
    const tenantId = this.tenantId(user);
    const order = await this.prisma.purchase_orders.findFirst({
      where: { id, ...this.tenantWhere(user) },
      include: { purchase_order_items: true },
    });
    if (!order) throw new NotFoundException('Purchase order not found');

    if (dto.status === 'RECEIVED' && order.status !== 'RECEIVED') {
      return this.prisma.$transaction(async (tx) => {
        for (const poItem of order.purchase_order_items) {
          let inventoryItem = await tx.inventory_items.findFirst({
            where: { tenantId, name: { equals: poItem.name, mode: 'insensitive' } },
          });

          if (!inventoryItem) {
            inventoryItem = await tx.inventory_items.create({
              data: {
                tenantId,
                name: poItem.name,
                quantity: poItem.quantity,
                unit: 'PIECE',
                costPerUnit: poItem.unitPrice,
                supplierId: order.supplierId,
              },
            });

            await tx.inventory_movements.create({
              data: {
                tenantId,
                inventoryItemId: inventoryItem.id,
                type: 'PURCHASE',
                quantity: poItem.quantity,
                unit: 'PIECE',
                beforeQuantity: 0,
                afterQuantity: poItem.quantity,
                referenceType: 'PURCHASE_ORDER',
                referenceId: order.id,
                reason: `Goods received for Purchase Order ${order.id}`,
                createdBy: user?.id,
              },
            });
          } else {
            const beforeQty = Number(inventoryItem.quantity);
            const addQty = Number(poItem.quantity);
            const afterQty = this.roundQuantity(beforeQty + addQty);

            await tx.inventory_items.update({
              where: { id: inventoryItem.id },
              data: {
                quantity: afterQty,
                costPerUnit: poItem.unitPrice,
              },
            });

            await tx.inventory_movements.create({
              data: {
                tenantId,
                inventoryItemId: inventoryItem.id,
                type: 'PURCHASE',
                quantity: addQty,
                unit: inventoryItem.unit,
                beforeQuantity: beforeQty,
                afterQuantity: afterQty,
                referenceType: 'PURCHASE_ORDER',
                referenceId: order.id,
                reason: `Goods received for Purchase Order ${order.id}`,
                createdBy: user?.id,
              },
            });
          }
        }

        return tx.purchase_orders.update({
          where: { id },
          data: { status: 'RECEIVED' },
          include: { purchase_order_items: true, suppliers: true },
        });
      });
    }

    return this.prisma.purchase_orders.update({
      where: { id },
      data: { status: dto.status },
      include: { purchase_order_items: true, suppliers: true },
    });
  }

  async getMenuItemIngredients(user: JwtUser | undefined, menuItemId: string) {
    await this.assertMenuItem(user, menuItemId);

    const recipeItems = await this.prisma.menu_item_ingredients.findMany({
      where: { menuItemId, ...this.tenantWhere(user) },
      include: { inventory_items: true },
      orderBy: { createdAt: 'asc' },
    });

    let totalRecipeCost = 0;
    const formattedIngredients = recipeItems.map((item) => {
      const recipeQty = Number(item.quantity);
      const wastagePct = Number(item.wastagePercent ?? 0);
      const recipeUnit = item.unit || item.inventory_items.unit;
      const invUnit = item.inventory_items.unit;
      const costPerUnit = Number(item.inventory_items.costPerUnit ?? 0);

      let convertedQty = recipeQty;
      try {
        convertedQty = convertUnit(recipeQty, recipeUnit, invUnit);
      } catch (err) {
        convertedQty = recipeQty;
      }

      const totalQtyWithWastage = convertedQty * (1 + wastagePct / 100);
      const ingredientCost = this.roundQuantity(totalQtyWithWastage * costPerUnit);
      totalRecipeCost += ingredientCost;

      return {
        ...item,
        unit: recipeUnit,
        wastagePercent: wastagePct,
        convertedQuantityInStockUnit: this.roundQuantity(totalQtyWithWastage),
        ingredientCost,
      };
    });

    return {
      menuItemId,
      recipeCost: this.roundQuantity(totalRecipeCost),
      ingredients: formattedIngredients,
    };
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
        select: { id: true, unit: true },
      });

      if (inventoryItems.length !== new Set(inventoryIds).size) {
        throw new BadRequestException(
          'One or more inventory items are invalid for this restaurant',
        );
      }

      const invById = new Map(inventoryItems.map((i) => [i.id, i]));
      for (const ing of dto.ingredients) {
        const invItem = invById.get(ing.inventoryItemId);
        if (invItem && ing.unit) {
          // Validate conversion compatibility immediately
          convertUnit(ing.quantity, ing.unit, invItem.unit);
        }
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
            unit: ingredient.unit ? normalizeUnit(ingredient.unit) : 'GRAM',
            wastagePercent: ingredient.wastagePercent ?? 0,
          })),
        });
      }
    });

    return this.getMenuItemIngredients(user, menuItemId);
  }

  async getMovements(
    user: JwtUser | undefined,
    filters?: { type?: string; inventoryItemId?: string },
  ) {
    const where: Prisma.inventory_movementsWhereInput = {
      ...this.tenantWhere(user),
    };

    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.inventoryItemId) {
      where.inventoryItemId = filters.inventoryItemId;
    }

    return this.prisma.inventory_movements.findMany({
      where,
      include: { inventory_items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getDashboardSummary(user: JwtUser | undefined) {
    const items = await this.getItems(user);
    const lowStockCount = items.filter((i) => i.isLowStock).length;
    const outOfStockCount = items.filter((i) => i.isOutOfStock).length;
    const totalStockValue = this.roundQuantity(
      items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.costPerUnit ?? 0),
        0,
      ),
    );

    const recentMovements = await this.getMovements(user);

    const topConsumedMovements = await this.prisma.inventory_movements.groupBy({
      by: ['inventoryItemId'],
      where: {
        ...this.tenantWhere(user),
        type: 'SALE_CONSUMPTION',
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topConsumed = await Promise.all(
      topConsumedMovements.map(async (row) => {
        const item = await this.prisma.inventory_items.findUnique({
          where: { id: row.inventoryItemId },
          select: { id: true, name: true, unit: true },
        });
        return {
          inventoryItemId: row.inventoryItemId,
          name: item?.name ?? 'Unknown',
          unit: item?.unit ?? '',
          totalQuantity: Number(row._sum.quantity ?? 0),
        };
      }),
    );

    return {
      totalItems: items.length,
      lowStockCount,
      outOfStockCount,
      totalStockValue,
      recentMovements,
      topConsumed,
    };
  }

  async consumeForOrder(
    client: InventoryWriteClient,
    input: {
      tenantId: string;
      orderId: string;
      items: Array<{ id: string; menuItemId: string; quantity: number }>;
    },
  ): Promise<Array<{ inventoryItemId: string; quantity: number }>> {
    // 1. Check idempotency: Have we already consumed stock for this orderId?
    const existingMovements = await client.inventory_movements.findFirst({
      where: {
        tenantId: input.tenantId,
        orderId: input.orderId,
        type: 'SALE_CONSUMPTION',
      },
    });

    if (existingMovements) {
      // Stock already consumed for this order — return empty array / idempotent skip
      return [];
    }

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
      unit: string;
      beforeQuantity: number;
      afterQuantity: number;
    }> = [];

    for (const ingredient of ingredients) {
      const orderItem = orderItemByMenuId.get(ingredient.menuItemId);
      if (!orderItem) continue;

      const recipeQty = Number(ingredient.quantity);
      const recipeUnit = ingredient.unit || ingredient.inventory_items.unit;
      const invUnit = ingredient.inventory_items.unit;
      const wastagePct = Number(ingredient.wastagePercent ?? 0);

      // Perform Unit Conversion: recipe unit -> inventory stock unit
      const convertedQty = convertUnit(recipeQty, recipeUnit, invUnit);
      const totalPerItem = convertedQty * (1 + wastagePct / 100);
      const totalRequired = this.roundQuantity(totalPerItem * orderItem.quantity);

      const current = requiredByInventory.get(ingredient.inventoryItemId) ?? 0;
      requiredByInventory.set(
        ingredient.inventoryItemId,
        this.roundQuantity(current + totalRequired),
      );

      movementRows.push({
        inventoryItemId: ingredient.inventoryItemId,
        orderItemId: orderItem.id,
        quantity: totalRequired,
        menuItemId: ingredient.menuItemId,
        unit: invUnit,
        beforeQuantity: 0,
        afterQuantity: 0,
      });
    }

    const inventoryItems = await client.inventory_items.findMany({
      where: {
        tenantId: input.tenantId,
        id: { in: Array.from(requiredByInventory.keys()) },
      },
      select: { id: true, name: true, quantity: true, unit: true },
    });

    const inventoryById = new Map(
      inventoryItems.map((item) => [item.id, item]),
    );

    // Negative stock protection check
    for (const [inventoryItemId, required] of requiredByInventory.entries()) {
      const item = inventoryById.get(inventoryItemId);
      if (!item) {
        throw new BadRequestException('Inventory recipe mapping is invalid');
      }

      if (Number(item.quantity) < required) {
        throw new BadRequestException(
          `Insufficient stock for ${item.name}. Required ${required} ${item.unit}, available ${item.quantity} ${item.unit}`,
        );
      }
    }

    // Perform decrement and record immutable movements with before/after quantities
    for (const row of movementRows) {
      const item = inventoryById.get(row.inventoryItemId)!;
      const beforeQty = Number(item.quantity);
      const afterQty = this.roundQuantity(beforeQty - row.quantity);

      row.beforeQuantity = beforeQty;
      row.afterQuantity = afterQty;

      await client.inventory_items.update({
        where: { id: row.inventoryItemId },
        data: { quantity: afterQty },
      });

      // Update local map so subsequent item deductions for same inventory item track cumulative before/after
      item.quantity = new Prisma.Decimal(afterQty);
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
          unit: row.unit,
          beforeQuantity: row.beforeQuantity,
          afterQuantity: row.afterQuantity,
          referenceType: 'ORDER',
          referenceId: input.orderId,
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
