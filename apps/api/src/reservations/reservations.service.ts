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
    const duration = dto.durationMinutes ?? 60;
    await this.assertTableAvailable(
      user,
      dto.tableId,
      new Date(dto.reservationAt),
      duration,
    );

    return this.prisma.reservations.create({
      data: {
        restaurantId,
        tableId: dto.tableId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        guestCount: dto.guestCount,
        reservationAt: new Date(dto.reservationAt),
        durationMinutes: duration,
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
    const duration = dto.durationMinutes ?? existing.durationMinutes;

    await this.assertTableAvailable(user, tableId, reservationAt, duration, id);

    return this.prisma.reservations.update({
      where: { id },
      data: {
        ...dto,
        reservationAt,
        durationMinutes: duration,
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
    const start = new Date(reservationAt);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Assume 1 hour check
    const [tables, reservations] = await Promise.all([
      this.prisma.tables.findMany({
        where: { restaurantId, isActive: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.reservations.findMany({
        where: {
          restaurantId,
          status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
        },
      }),
    ]);

    const reservedTableIds = new Set(
      reservations
        .filter((r) => {
          const rStart = new Date(r.reservationAt);
          const rDuration = r.durationMinutes ?? 60;
          const rEnd = new Date(rStart.getTime() + rDuration * 60 * 1000);
          return start < rEnd && end > rStart;
        })
        .map((r) => r.tableId),
    );

    return tables.map((table) => ({
      ...table,
      isAvailable: !reservedTableIds.has(table.id),
    }));
  }

  private async assertTableAvailable(
    user: JwtUser | undefined,
    tableId: string,
    reservationAt: Date,
    durationMinutes: number = 60,
    excludeReservationId?: string,
  ) {
    const restaurantId = this.restaurantId(user);
    const table = await this.prisma.tables.findFirst({
      where: { id: tableId, restaurantId, isActive: true },
    });
    if (!table)
      throw new BadRequestException('Table is invalid for this restaurant');

    const start = new Date(reservationAt);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const existing = await this.prisma.reservations.findMany({
      where: {
        tableId,
        restaurantId,
        id: excludeReservationId ? { not: excludeReservationId } : undefined,
        status: { in: ['PENDING', 'CONFIRMED', 'SEATED'] },
      },
    });

    const isOverlap = existing.some((r) => {
      const rStart = new Date(r.reservationAt);
      const rDuration = r.durationMinutes ?? 60;
      const rEnd = new Date(rStart.getTime() + rDuration * 60 * 1000);
      return start < rEnd && end > rStart;
    });

    if (isOverlap) {
      throw new BadRequestException(
        'Table is not available for this time range',
      );
    }
  }
}
