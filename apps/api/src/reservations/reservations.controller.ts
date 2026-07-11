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
  CreateReservationDto,
  UpdateReservationDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @RequirePermission('reservations:write')
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
  @RequirePermission('reservations:read')
  async getReservations(@Req() req: AuthenticatedRequest) {
    return apiSuccess(await this.reservationsService.getReservations(req.user));
  }

  @Get('availability')
  @RequirePermission('reservations:read')
  async tableAvailability(
    @Req() req: AuthenticatedRequest,
    @Query('reservationAt') reservationAt: string,
  ) {
    return apiSuccess(
      await this.reservationsService.tableAvailability(req.user, reservationAt),
    );
  }

  @Get(':id')
  @RequirePermission('reservations:read')
  async getReservation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return apiSuccess(
      await this.reservationsService.getReservation(req.user, id),
    );
  }

  @Patch(':id')
  @RequirePermission('reservations:write')
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
  @RequirePermission('reservations:write')
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
  @RequirePermission('reservations:write')
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
