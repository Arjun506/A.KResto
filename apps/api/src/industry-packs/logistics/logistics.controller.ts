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
import { LogisticsService } from './logistics.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Logistics Industry Pack — Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly service: LogisticsService) {}

  @Post('hubs')
  @ApiOperation({ summary: 'Register a distribution hub' })
  async createHub(@Body() body: CreateHubDto & { tenantId?: string }) {
    return this.service.createHub(body.tenantId || 'GLOBAL', body);
  }

  @Get('hubs')
  @ApiOperation({ summary: 'List registered hubs' })
  async listHubs(@Query('tenantId') tenantId: string) {
    return this.service.listHubs(tenantId || 'GLOBAL');
  }

  @Post('vehicles')
  @ApiOperation({ summary: 'Add a vehicle to fleet registry' })
  async createVehicle(@Body() body: CreateVehicleDto & { tenantId?: string }) {
    return this.service.createVehicle(body.tenantId || 'GLOBAL', body);
  }

  @Post('vehicles/:id/assign-driver')
  @ApiOperation({ summary: 'Assign driver workforce employee to vehicle' })
  async assignDriver(
    @Param('id') id: string,
    @Body() body: { driverEmployeeId: string },
  ) {
    return this.service.assignDriver(id, body.driverEmployeeId);
  }

  @Post('vehicles/:id/maintenance')
  @ApiOperation({ summary: 'Log vehicle maintenance cost expense' })
  async logMaintenance(
    @Param('id') id: string,
    @Body() body: { description: string; cost: number },
  ) {
    return this.service.logMaintenance(id, body.description, body.cost);
  }

  @Post('shipments')
  @ApiOperation({ summary: 'Create a shipment dispatch ticket' })
  async createShipment(
    @Body() body: CreateShipmentDto & { tenantId?: string },
  ) {
    return this.service.createShipment(body.tenantId || 'GLOBAL', body);
  }

  @Patch('shipments/:id/status')
  @ApiOperation({ summary: 'Transition shipment status' })
  async transitionStatus(
    @Param('id') id: string,
    @Body() body: { status: string; reason?: string },
  ) {
    return this.service.transitionShipmentStatus(id, body.status, body.reason);
  }

  @Post('shipments/:id/pickup-schedule')
  @ApiOperation({ summary: 'Schedule shipment pickup time' })
  async schedulePickup(
    @Param('id') id: string,
    @Body() body: { scheduledAt: string },
  ) {
    return this.service.schedulePickup(id, new Date(body.scheduledAt));
  }

  @Post('routes')
  @ApiOperation({ summary: 'Create dispatch route with stops' })
  async createRoute(@Body() body: CreateRouteDto & { tenantId?: string }) {
    return this.service.createRoute(body.tenantId || 'GLOBAL', body);
  }

  @Patch('routes/:id/start')
  @ApiOperation({ summary: 'Start route run' })
  async startRoute(@Param('id') id: string) {
    return this.service.startRoute(id);
  }

  @Post('shipments/:id/pod')
  @ApiOperation({ summary: 'Record proof of delivery confirmation' })
  async recordPOD(
    @Param('id') id: string,
    @Body()
    body: {
      recipientName: string;
      driverEmployeeId: string;
      signatureRef?: string;
      photoRef?: string;
      otpCode?: string;
    },
  ) {
    return this.service.recordPOD(
      id,
      body.recipientName,
      body.driverEmployeeId,
      body.signatureRef,
      body.photoRef,
      body.otpCode,
    );
  }

  @Post('shipments/:id/cod')
  @ApiOperation({ summary: 'Record COD collection amount' })
  async collectCOD(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.service.collectCOD(id, body.amount);
  }

  @Patch('cod-collections/:id/reconcile')
  @ApiOperation({ summary: 'Reconcile collected COD cash' })
  async reconcileCOD(@Param('id') id: string) {
    return this.service.reconcileCOD(id);
  }

  @Get('shipments/:id/timeline')
  @ApiOperation({ summary: 'Get shipment tracking timeline history' })
  async getTimeline(@Param('id') id: string) {
    return this.service.getShipmentTimeline(id);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Retrieve fleet utilization analytics metrics' })
  async getAnalytics(@Query('tenantId') tenantId: string) {
    return this.service.fetchLogisticsAnalytics(tenantId || 'GLOBAL');
  }
}
