import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TenantGuard } from '../tenant/tenant.guard';
import { PrismaService } from '../prisma/prisma.service';
import { apiSuccess } from '../common/responses/api-response';
import type { AuthenticatedRequest } from '../common/types/authenticated-request.interface';

@Controller('restaurants/tables')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class TablesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Roles(
    'RESTAURANT_OWNER',
    'OWNER',
    'MANAGER',
    'CASHIER',
    'WAITER',
    'SUPER_ADMIN',
  )
  async getTables(@Req() req: AuthenticatedRequest) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) return apiSuccess([]);

    // Fetch tables
    const tables = await this.prisma.tables.findMany({
      where: { tenantId },
      orderBy: { code: 'asc' },
    });

    // Fetch active orders to compute status
    const activeOrders = await this.prisma.orders.findMany({
      where: {
        tenantId,
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
      },
    });

    // Fetch confirmed reservations for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const activeReservations = await this.prisma.reservations.findMany({
      where: {
        tenantId,
        status: 'CONFIRMED',
        reservationAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const mappedTables = tables.map((table) => {
      const activeOrder = activeOrders.find((o) => o.tableId === table.id);
      const isReserved = activeReservations.some((r) => r.tableId === table.id);

      let status = 'available';
      if (activeOrder) {
        status = 'occupied';
      } else if (isReserved) {
        status = 'reserved';
      }

      return {
        ...table,
        status,
        activeOrderId: activeOrder?.id || null,
        currentGuests: activeOrder ? 2 : 0,
      };
    });

    return apiSuccess(mappedTables);
  }

  @Post()
  @Roles('RESTAURANT_OWNER', 'OWNER', 'MANAGER', 'SUPER_ADMIN')
  async createTable(
    @Req() req: AuthenticatedRequest,
    @Body() body: { name: string; code: string; capacity: number },
  ) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new BadRequestException('Missing tenantId');

    const created = await this.prisma.tables.create({
      data: {
        tenantId,
        name: body.name,
        code: body.code,
        capacity: Number(body.capacity) || 2,
        qrCode: `qr-${tenantId}-${body.code}`,
      },
    });
    return apiSuccess(created, 'Table created');
  }

  @Patch(':id')
  @Roles('RESTAURANT_OWNER', 'OWNER', 'MANAGER', 'SUPER_ADMIN')
  async updateTable(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: { name?: string; capacity?: number },
  ) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new BadRequestException('Missing tenantId');

    const updated = await this.prisma.tables.updateMany({
      where: { id, tenantId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.capacity && { capacity: Number(body.capacity) }),
      },
    });

    if (updated.count === 0) {
      throw new BadRequestException('Table not found for this restaurant');
    }

    const table = await this.prisma.tables.findFirst({
      where: { id, tenantId },
    });

    return apiSuccess(table, 'Table updated');
  }

  @Delete(':id')
  @Roles('RESTAURANT_OWNER', 'OWNER', 'MANAGER', 'SUPER_ADMIN')
  async deleteTable(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw new BadRequestException('Missing tenantId');

    await this.prisma.tables.deleteMany({
      where: { id, tenantId },
    });
    return apiSuccess({ id }, 'Table deleted');
  }
}
