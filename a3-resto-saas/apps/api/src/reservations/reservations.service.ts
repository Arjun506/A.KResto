import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { JwtUser } from '../common/types/jwt-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
  UpdateReservationStatusDto,
} from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  private isSuperAdmin(user: JwtUser | undefined) {
    return user?.role === 'SUPER_ADMIN';
  }

  private restaurantId(user: JwtUser | undefined) {
    if (!user?.restaurantId) {
      throw new ForbiddenException('Missing restaurantId for tenant access');
    }

    return user.restaurantId;
  }

  private tenantWhere(user: JwtUser | undefined) {
    if (this.isSuperAdmin(user) && !user?.restaurantId) return {};
    return { restaurantId: this.restaurantId(user) };
  }

  async createReservation(
    user: JwtUser | undefined,
    dto: CreateReservationDto,
  ) {
    const restaurantId = this.restaurantId(user);
    await this.assertTableAvailable(
      user,
      dto.tableId,
      new Date(dto.reservationAt),
    );

    return this.prisma.reservations.create({
      data: {
        restaurantId,
        tableId: dto.tableId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        guestCount: dto.guestCount,
        reservationAt: new Date(dto.reservationAt),
        notes: dto.notes,
        userId: user?.id,
      },
      include: { tables: true },
    });
  }

  async getReservations(user: JwtUser | undefined) {
    return this.prisma.reservations.findMany({
      where: this.tenantWhere(user),
      orderBy: { reservationAt: 'asc' },
      include: { tables: true },
    });
  }

  async getReservation(user: JwtUser | undefined, id: string) {
    const reservation = await this.prisma.reservations.findFirst({
      where: { id, ...this.tenantWhere(user) },
      include: { tables: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async updateReservation(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateReservationDto,
  ) {
    const existing = await this.getReservation(user, id);
    const tableId = dto.tableId ?? existing.tableId;
    const reservationAt = dto.reservationAt
      ? new Date(dto.reservationAt)
      : existing.reservationAt;

    await this.assertTableAvailable(user, tableId, reservationAt, id);

    return this.prisma.reservations.update({
      where: { id },
      data: {
        ...dto,
        reservationAt,
      },
      include: { tables: true },
    });
  }

  async updateStatus(
    user: JwtUser | undefined,
    id: string,
    dto: UpdateReservationStatusDto,
  ) {
    await this.getReservation(user, id);

    return this.prisma.reservations.update({
      where: { id },
      data: { status: dto.status },
      include: { tables: true },
    });
  }

  async deleteReservation(user: JwtUser | undefined, id: string) {
    const deleted = await this.prisma.reservations.deleteMany({
      where: { id, ...this.tenantWhere(user) },
    });
    if (!deleted.count) throw new NotFoundException('Reservation not found');
    return { id };
  }

  async tableAvailability(user: JwtUser | undefined, reservationAt: string) {
    const restaurantId = this.restaurantId(user);
    const target = new Date(reservationAt);
    const [tables, reservations] = await Promise.all([
      this.prisma.tables.findMany({
        where: { restaurantId, isActive: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.reservations.findMany({
        where: {
          restaurantId,
          reservationAt: this.reservationWindow(target),
          status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
        },
        select: { tableId: true },
      }),
    ]);

    const reservedTableIds = new Set(reservations.map((r) => r.tableId));
    return tables.map((table) => ({
      ...table,
      isAvailable: !reservedTableIds.has(table.id),
    }));
  }

  private async assertTableAvailable(
    user: JwtUser | undefined,
    tableId: string,
    reservationAt: Date,
    excludeReservationId?: string,
  ) {
    const restaurantId = this.restaurantId(user);
    const table = await this.prisma.tables.findFirst({
      where: { id: tableId, restaurantId, isActive: true },
    });
    if (!table)
      throw new BadRequestException('Table is invalid for this restaurant');

    const existing = await this.prisma.reservations.findFirst({
      where: {
        tableId,
        restaurantId,
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        reservationAt: this.reservationWindow(reservationAt),
        status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
      },
    });

    if (existing) {
      throw new BadRequestException('Table is not available for this time');
    }
  }

  private reservationWindow(reservationAt: Date) {
    const from = new Date(reservationAt.getTime() - 90 * 60 * 1000);
    const to = new Date(reservationAt.getTime() + 90 * 60 * 1000);
    return { gte: from, lte: to };
  }
}
