import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantDiningService } from './restaurant-dining.service';
import { CreateRestaurantTableDto } from './dto/create-table.dto';
import { CreateRestaurantReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@ApiTags('Restaurant Pack — Kitchen & Dining')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant-dining')
export class RestaurantDiningController {
  constructor(private readonly service: RestaurantDiningService) {}

  @Post('tables')
  @ApiOperation({ summary: 'Register dining table layout' })
  async createTable(
    @Body() body: CreateRestaurantTableDto & { tenantId?: string },
  ) {
    return this.service.createTable(body.tenantId || 'GLOBAL', body);
  }

  @Patch('tables/:id/status')
  @ApiOperation({
    summary: 'Update table occupancy status (Available, Occupied, Reserved)',
  })
  async updateTableStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.service.updateTableStatus(id, body.status);
  }

  @Post('reservations')
  @ApiOperation({ summary: 'Confirm Advanced guest table booking' })
  async createReservation(
    @Body() body: CreateRestaurantReservationDto & { tenantId?: string },
  ) {
    return this.service.createReservation(body.tenantId || 'GLOBAL', body);
  }

  @Post('kds/tickets')
  @ApiOperation({ summary: 'Create kitchen display preparation ticket' })
  async createKdsTicket(
    @Body() body: { tenantId?: string; orderId: string; station: string },
  ) {
    return this.service.createKitchenTicket(
      body.tenantId || 'GLOBAL',
      body.orderId,
      body.station,
    );
  }

  @Patch('kds/tickets/:id/complete')
  @ApiOperation({ summary: 'Set kitchen ticket status to ready to serve' })
  async completeKdsTicket(@Param('id') id: string) {
    return this.service.completeKitchenTicket(id);
  }

  @Get('waitlist')
  @ApiOperation({ summary: 'Retrieve live walk-in waiting list queue' })
  async listWaitlist(@Query('tenantId') tenantId: string) {
    return this.service.listWaitlist(tenantId || 'GLOBAL');
  }
}
