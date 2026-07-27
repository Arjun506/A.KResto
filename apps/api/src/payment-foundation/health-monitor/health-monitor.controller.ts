import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GatewayHealthMonitorService } from './health-monitor.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Payment Foundation — Health Monitor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('gateway-health')
export class GatewayHealthMonitorController {
  constructor(private readonly service: GatewayHealthMonitorService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get payment gateway health metrics (Availability, Latency, Failure Rate)',
  })
  async getMetrics() {
    return this.service.getMetrics();
  }
}
