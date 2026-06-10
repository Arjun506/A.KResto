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
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';
import { TenantGuard } from '../tenant/tenant.guard';
import {
  CreateReservationDto,
  UpdateReservationDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async createReservation(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReservationDto,
  ) {
    return apiSuccess(
      await this.reservationsService.createReservation(req.user, dto),
      'Reservation created',
    );
  }

  @Get()
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async getReservations(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.reservationsService.getReservations(req.user));
  }

  @Get('availability')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async tableAvailability(
    @Req() req: AuthenticatedRequest,
    @Query('reservationAt') reservationAt: string,
  ) {
    return apiSuccess(
      await this.reservationsService.tableAvailability(req.user, reservationAt),
    );
  }

  @Get(':id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async getReservation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.reservationsService.getReservation(req.user, id),
    );
  }

  @Patch(':id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async updateReservation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return apiSuccess(
      await this.reservationsService.updateReservation(req.user, id, dto),
      'Reservation updated',
    );
  }

  @Patch(':id/status')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'WAITER', 'SUPER_ADMIN')
  async updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    return apiSuccess(
      await this.reservationsService.updateStatus(req.user, id, dto),
      'Reservation status updated',
    );
  }

  @Delete(':id')
  @Roles('OWNER', 'RESTAURANT_OWNER', 'MANAGER', 'SUPER_ADMIN')
  async deleteReservation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.reservationsService.deleteReservation(req.user, id),
      'Reservation deleted',
    );
  }
}
