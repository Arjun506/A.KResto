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
import { HotelService } from './hotel.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Hotel Industry Pack — Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hotel')
export class HotelController {
  constructor(private readonly service: HotelService) {}

  @Post('properties')
  @ApiOperation({ summary: 'Register a new hotel property profile' })
  async createProperty(
    @Body() body: CreatePropertyDto & { tenantId?: string },
  ) {
    return this.service.createProperty(body.tenantId || 'GLOBAL', body);
  }

  @Get('properties')
  @ApiOperation({ summary: 'List all registered hotel properties' })
  async listProperties(@Query('tenantId') tenantId: string) {
    return this.service.listProperties(tenantId || 'GLOBAL');
  }

  @Post('room-types')
  @ApiOperation({ summary: 'Configure a room type classification' })
  async createRoomType(
    @Body() body: CreateRoomTypeDto & { tenantId?: string },
  ) {
    return this.service.createRoomType(body.tenantId || 'GLOBAL', body);
  }

  @Post('rooms')
  @ApiOperation({ summary: 'Add a physical room to a property' })
  async createRoom(@Body() body: CreateRoomDto & { tenantId?: string }) {
    return this.service.createRoom(body.tenantId || 'GLOBAL', body);
  }

  @Patch('rooms/:id/status')
  @ApiOperation({ summary: 'Transition room occupancy and status checks' })
  async updateRoomStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.service.updateRoomStatus(id, body.status);
  }

  @Post('bookings')
  @ApiOperation({ summary: 'Reserve rooms check-ins bookings' })
  async createBooking(@Body() body: CreateBookingDto & { tenantId?: string }) {
    return this.service.createBooking(body.tenantId || 'GLOBAL', body);
  }

  @Post('bookings/:id/checkin')
  @ApiOperation({
    summary: 'Complete guest registration identity and key card check-in',
  })
  async checkIn(@Param('id') id: string) {
    return this.service.checkIn(id);
  }

  @Post('bookings/:id/checkout')
  @ApiOperation({
    summary: 'Generate checkout splits and outstanding invoice checkout',
  })
  async checkOut(@Param('id') id: string) {
    return this.service.checkOut(id);
  }

  @Post('housekeeping')
  @ApiOperation({ summary: 'Assign a room cleaning housekeeping task' })
  async createHousekeeping(
    @Body()
    body: {
      roomId: string;
      assignedEmployeeId?: string;
      notes?: string;
    },
  ) {
    return this.service.createHousekeepingTask(
      body.roomId,
      body.assignedEmployeeId,
      body.notes,
    );
  }

  @Patch('housekeeping/:id/complete')
  @ApiOperation({ summary: 'Sign off room inspection housekeeping task' })
  async completeHousekeeping(@Param('id') id: string) {
    return this.service.completeHousekeepingTask(id);
  }

  @Post('maintenance')
  @ApiOperation({ summary: 'File a room repair maintenance request ticket' })
  async logMaintenance(@Body() body: { roomId: string; description: string }) {
    return this.service.logMaintenanceIssue(body.roomId, body.description);
  }

  @Post('bookings/:id/digital-key')
  @ApiOperation({ summary: 'Issue access key tokens' })
  async issueKey(@Param('id') id: string) {
    return this.service.issueDigitalKey(id);
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Retrieve RevPAR and Occupancy rate analytics metrics',
  })
  async getAnalytics(@Query('tenantId') tenantId: string) {
    return this.service.fetchOccupancyAnalytics(tenantId || 'GLOBAL');
  }

  @Post('guests/:id/preferences')
  @ApiOperation({ summary: 'Update guest pillow and stay preferences' })
  async updateGuestPrefs(
    @Param('id') id: string,
    @Body() body: { notes: string },
  ) {
    return this.service.updateGuestPreferences(id, body.notes);
  }
}
