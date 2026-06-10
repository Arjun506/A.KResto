import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { WaiterRequestDto } from './dto/waiter-request.dto';
import { apiSuccess } from '../common/responses/api-response';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('restaurant/:restaurantSlug')
  async getRestaurant(@Param('restaurantSlug') slug: string) {
    return apiSuccess(await this.publicService.getRestaurant(slug));
  }

  @Get('menu/:restaurantSlug')
  async getMenu(@Param('restaurantSlug') slug: string) {
    return apiSuccess(await this.publicService.getMenu(slug));
  }

  @Get('categories/:restaurantSlug')
  async getCategories(@Param('restaurantSlug') slug: string) {
    return apiSuccess(await this.publicService.getCategories(slug));
  }

  @Post('orders')
  async createOrder(@Body() dto: CreatePublicOrderDto) {
    return apiSuccess(await this.publicService.createOrder(dto), 'Order created');
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return apiSuccess(await this.publicService.getOrder(id));
  }

  @Post('waiter-request')
  async waiterRequest(@Body() dto: WaiterRequestDto) {
    return apiSuccess(await this.publicService.handleWaiterRequest(dto), 'Waiter notified');
  }
}
