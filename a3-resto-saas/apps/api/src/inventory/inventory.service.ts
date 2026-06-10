import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';

@Injectable()
export class InventoryService {
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

  async createItem(user: JwtUser | undefined, dto: CreateInventoryItemDto) {
    const restaurantId = this.restaurantId(user);
    await this.assertSupplier(user, dto.supplierId);

    return this.prisma.inventory_items.create({
      data: {
        restaurantId,
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
        restaurantId: this.restaurantId(user),
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
    const restaurantId = this.restaurantId(user);
    await this.assertSupplier(user, dto.supplierId);

    const totalAmount = dto.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.purchase_orders.create({
      data: {
        restaurantId,
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
}
