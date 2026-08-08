import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermission } from '../auth/require-permission.decorator';
import { KitchenService } from './kitchen.service';
import { KitchenStationsService } from './kitchen-stations.service';
import { CreateKitchenStationDto } from './dto/create-kitchen-station.dto';
import { UpdateKitchenTicketStatusDto } from './dto/update-kitchen-ticket-status.dto';
import { UpdateKitchenTicketPriorityDto } from './dto/update-kitchen-ticket-priority.dto';

@ApiTags('Kitchen Display System (KDS)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
@Controller('kitchen')
export class KitchenController {
  constructor(
    private readonly kitchenService: KitchenService,
    private readonly stationsService: KitchenStationsService,
  ) {}

  @Get('stations')
  @ApiOperation({ summary: 'Get active kitchen stations for tenant' })
  @RequirePermission(['kitchen:read', 'orders:read'])
  async getStations(@Req() req: any) {
    return this.stationsService.getStations(req.user);
  }

  @Post('stations')
  @ApiOperation({ summary: 'Create new kitchen station' })
  @RequirePermission(['kitchen:write', 'settings:write'])
  async createStation(
    @Body() dto: CreateKitchenStationDto,
    @Req() req: any,
  ) {
    return this.stationsService.createStation(req.user, dto);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Get kitchen tickets matching station and status filters' })
  @RequirePermission(['kitchen:read', 'orders:read'])
  async getTickets(
    @Query('station') stationCode?: string,
    @Query('status') status?: string,
    @Req() req: any = {},
  ) {
    return this.kitchenService.getTickets(req.user, stationCode, status);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get kitchen ticket by ID' })
  @RequirePermission(['kitchen:read', 'orders:read'])
  async getTicketById(@Param('id') id: string, @Req() req: any) {
    return this.kitchenService.getTicketById(req.user, id);
  }

  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Update kitchen ticket status (PENDING -> PREPARING -> READY -> SERVED)' })
  @RequirePermission(['kitchen:write', 'orders:write'])
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() dto: UpdateKitchenTicketStatusDto,
    @Req() req: any,
  ) {
    return this.kitchenService.updateTicketStatus(req.user, id, dto);
  }

  @Patch('tickets/:id/priority')
  @ApiOperation({ summary: 'Update kitchen ticket priority (NORMAL, HIGH, URGENT)' })
  @RequirePermission(['kitchen:write', 'orders:write'])
  async updateTicketPriority(
    @Param('id') id: string,
    @Body() dto: UpdateKitchenTicketPriorityDto,
    @Req() req: any,
  ) {
    return this.kitchenService.updateTicketPriority(req.user, id, dto);
  }
}
