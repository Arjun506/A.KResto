import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
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
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('items')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CHEF', 'SUPER_ADMIN')
  async createItem(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateInventoryItemDto,
  ) {
    return apiSuccess(
      await this.inventoryService.createItem(req.user, dto),
      'Inventory item created',
    );
  }

  @Get('items')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CHEF', 'SUPER_ADMIN')
  async getItems(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getItems(req.user));
  }

  @Patch('items/:id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CHEF', 'SUPER_ADMIN')
  async updateItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
  ) {
    return apiSuccess(
      await this.inventoryService.updateItem(req.user, id, dto),
      'Inventory item updated',
    );
  }

  @Patch('items/:id/deduct')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CHEF', 'SUPER_ADMIN')
  async deductStock(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: DeductStockDto,
  ) {
    return apiSuccess(
      await this.inventoryService.deductStock(req.user, id, dto),
      'Stock deducted',
    );
  }

  @Delete('items/:id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async deleteItem(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return apiSuccess(
      await this.inventoryService.deleteItem(req.user, id),
      'Inventory item deleted',
    );
  }

  @Get('alerts/low-stock')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'CHEF', 'SUPER_ADMIN')
  async lowStockAlerts(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.lowStockAlerts(req.user));
  }

  @Post('suppliers')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async createSupplier(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateSupplierDto,
  ) {
    return apiSuccess(
      await this.inventoryService.createSupplier(req.user, dto),
      'Supplier created',
    );
  }

  @Get('suppliers')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async getSuppliers(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getSuppliers(req.user));
  }

  @Patch('suppliers/:id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async updateSupplier(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    return apiSuccess(
      await this.inventoryService.updateSupplier(req.user, id, dto),
      'Supplier updated',
    );
  }

  @Delete('suppliers/:id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async deleteSupplier(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.inventoryService.deleteSupplier(req.user, id),
      'Supplier deleted',
    );
  }

  @Post('purchase-orders')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async createPurchaseOrder(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePurchaseOrderDto,
  ) {
    return apiSuccess(
      await this.inventoryService.createPurchaseOrder(req.user, dto),
      'Purchase order created',
    );
  }

  @Get('purchase-orders')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async getPurchaseOrders(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getPurchaseOrders(req.user));
  }

  @Patch('purchase-orders/:id/status')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async updatePurchaseOrderStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseOrderStatusDto,
  ) {
    return apiSuccess(
      await this.inventoryService.updatePurchaseOrderStatus(req.user, id, dto),
      'Purchase order status updated',
    );
  }
}
