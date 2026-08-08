import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
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
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('items')
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:read')
  async getItems(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getItems(req.user));
  }

  @Patch('items/:id')
  @RequirePermission('inventory:write')
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

  @Patch('items/:id/adjust')
  @RequirePermission('inventory:write')
  async adjustStock(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AdjustStockDto,
  ) {
    return apiSuccess(
      await this.inventoryService.adjustStock(req.user, id, dto),
      'Stock adjusted successfully',
    );
  }

  @Patch('items/:id/deduct')
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:write')
  async deleteItem(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return apiSuccess(
      await this.inventoryService.deleteItem(req.user, id),
      'Inventory item deleted',
    );
  }

  @Get('dashboard/summary')
  @RequirePermission('inventory:read')
  async getDashboardSummary(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getDashboardSummary(req.user));
  }

  @Get('alerts/low-stock')
  @RequirePermission('inventory:read')
  async lowStockAlerts(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.lowStockAlerts(req.user));
  }

  @Get('movements')
  @RequirePermission('inventory:read')
  async getMovements(
    @Req() req: AuthenticatedRequest,
    @Query('type') type?: string,
    @Query('inventoryItemId') inventoryItemId?: string,
  ) {
    return apiSuccess(
      await this.inventoryService.getMovements(req.user, { type, inventoryItemId }),
    );
  }

  @Get('menu-items/:menuItemId/ingredients')
  @RequirePermission('inventory:read')
  async getMenuItemIngredients(
    @Req() req: AuthenticatedRequest,
    @Param('menuItemId') menuItemId: string,
  ) {
    return apiSuccess(
      await this.inventoryService.getMenuItemIngredients(req.user, menuItemId),
    );
  }

  @Get('menu-items/:menuItemId/recipe')
  @RequirePermission('inventory:read')
  async getMenuItemRecipe(
    @Req() req: AuthenticatedRequest,
    @Param('menuItemId') menuItemId: string,
  ) {
    return apiSuccess(
      await this.inventoryService.getMenuItemIngredients(req.user, menuItemId),
    );
  }

  @Patch('menu-items/:menuItemId/ingredients')
  @RequirePermission('inventory:write')
  async setMenuItemIngredients(
    @Req() req: AuthenticatedRequest,
    @Param('menuItemId') menuItemId: string,
    @Body() dto: SetMenuItemIngredientsDto,
  ) {
    return apiSuccess(
      await this.inventoryService.setMenuItemIngredients(
        req.user,
        menuItemId,
        dto,
      ),
      'Menu item recipe updated',
    );
  }

  @Post('suppliers')
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:read')
  async getSuppliers(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getSuppliers(req.user));
  }

  @Patch('suppliers/:id')
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:write')
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
  @RequirePermission('inventory:read')
  async getPurchaseOrders(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.inventoryService.getPurchaseOrders(req.user));
  }

  @Patch('purchase-orders/:id/status')
  @RequirePermission('inventory:write')
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
