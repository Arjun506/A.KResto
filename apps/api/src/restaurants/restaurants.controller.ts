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
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'SUPER_ADMIN')
  async getRestaurants(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.restaurantsService.listRestaurants(req.user));
  }

  @Post()
  @Roles('OWNER', 'MANAGER', 'SUPER_ADMIN')
  async createRestaurant(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRestaurantDto,
  ) {
    const data = await this.restaurantsService.createRestaurant(req.user, dto);
    return apiSuccess(data, 'Restaurant created');
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'SUPER_ADMIN')
  async getRestaurant(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    if (id === 'tables') {
      return apiSuccess([]);
    }
    const data = await this.restaurantsService.getRestaurant(req.user, id);
    return apiSuccess(data);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER', 'SUPER_ADMIN')
  async updateRestaurant(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    const data = await this.restaurantsService.updateRestaurant(
      req.user,
      id,
      dto,
    );
    return apiSuccess(data, 'Restaurant updated');
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER', 'SUPER_ADMIN')
  async deleteRestaurant(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.restaurantsService.deleteRestaurant(req.user, id);
    return apiSuccess({ id }, 'Restaurant deleted');
  }
}
