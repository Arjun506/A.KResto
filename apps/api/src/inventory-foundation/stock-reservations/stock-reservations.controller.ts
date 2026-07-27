import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockReservationsService } from './stock-reservations.service';
import { CreateReservationDto } from './create-reservation.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Inventory Foundation — Stock Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stock-reservations')
export class StockReservationsController {
  constructor(private readonly service: StockReservationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create stock reservation for order, quote, or rental',
  })
  async createReservation(@Body() dto: CreateReservationDto) {
    return this.service.createReservation(dto);
  }

  @Post(':reservationId/release')
  @ApiOperation({
    summary: 'Release stock reservation back to available inventory',
  })
  async releaseReservation(@Param('reservationId') reservationId: string) {
    return this.service.releaseReservation(reservationId);
  }
}
