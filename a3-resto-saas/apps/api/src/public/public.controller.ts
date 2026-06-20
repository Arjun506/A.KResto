import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { WaiterRequestDto } from './dto/waiter-request.dto';
import { CreatePublicReservationDto } from './dto/create-public-reservation.dto';
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

  @Get('restaurant/:restaurantSlug/tables')
  async getRestaurantTables(@Param('restaurantSlug') slug: string) {
    return apiSuccess(await this.publicService.getRestaurantTables(slug));
  }

  @Get('table/:tableId/active-booking')
  async getTableActiveBooking(
    @Param('tableId') tableId: string,
    @Query('time') time?: string,
  ) {
    return apiSuccess(await this.publicService.getTableActiveBooking(tableId, time));
  }

  @Post('reservations')
  async createReservation(@Body() dto: CreatePublicReservationDto) {
    return apiSuccess(
      await this.publicService.createPublicReservation(dto),
      'Table pre-booked successfully',
    );
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
