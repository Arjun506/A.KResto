import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderVersioningService } from './order-versioning.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Order Foundation — Versioning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId/versions')
export class OrderVersioningController {
  constructor(private readonly service: OrderVersioningService) {}

  @Post()
  @ApiOperation({ summary: 'Create version snapshot of order state' })
  async createVersion(@Param('orderId') orderId: string, @Req() req: any) {
    return this.service.createVersion(orderId, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List version history for an order' })
  async getVersions(@Param('orderId') orderId: string) {
    return this.service.getVersions(orderId);
  }
}
