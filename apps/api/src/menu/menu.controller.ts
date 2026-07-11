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
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateMenuAvailabilityDto } from './dto/update-menu-availability.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuService } from './menu.service';

@Controller('menu')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('categories')
  @RequirePermission('pos:write')
  async createCategory(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCategoryDto,
  ) {
    return apiSuccess(
      await this.menuService.createCategory(req.user, dto),
      'Category created',
    );
  }

  @Get('categories')
  @RequirePermission('pos:read')
  async getCategories(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.menuService.getCategories(req.user));
  }

  @Patch('categories/:id')
  @RequirePermission('pos:write')
  async updateCategory(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return apiSuccess(
      await this.menuService.updateCategory(req.user, id, dto),
      'Category updated',
    );
  }

  @Delete('categories/:id')
  @RequirePermission('pos:write')
  async deleteCategory(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.menuService.deleteCategory(req.user, id),
      'Category deleted',
    );
  }

  @Post('items')
  @RequirePermission('pos:write')
  async createMenuItem(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMenuItemDto,
  ) {
    return apiSuccess(
      await this.menuService.createMenuItem(req.user, dto),
      'Menu item created',
    );
  }

  @Get('items')
  @RequirePermission('pos:read')
  async getMenuItems(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.menuService.getMenuItems(req.user));
  }

  @Get('items/:id')
  @RequirePermission('pos:read')
  async getMenuItem(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return apiSuccess(await this.menuService.getMenuItem(req.user, id));
  }

  @Patch('items/:id')
  @RequirePermission('pos:write')
  async updateMenuItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return apiSuccess(
      await this.menuService.updateMenuItem(req.user, id, dto),
      'Menu item updated',
    );
  }

  @Patch('items/:id/availability')
  @RequirePermission('pos:write')
  async updateAvailability(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateMenuAvailabilityDto,
  ) {
    return apiSuccess(
      await this.menuService.updateAvailability(req.user, id, dto),
      'Availability updated',
    );
  }

  @Delete('items/:id')
  @RequirePermission('pos:write')
  async deleteMenuItem(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.menuService.deleteMenuItem(req.user, id),
      'Menu item deleted',
    );
  }
}
