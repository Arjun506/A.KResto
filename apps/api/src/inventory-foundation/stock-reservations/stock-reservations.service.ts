import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservationDto } from './create-reservation.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  StockReservedEvent,
  StockReleasedEvent,
} from '../../event-bus/events/inventory.events';

@Injectable()
export class StockReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createReservation(dto: CreateReservationDto) {
    const stockLevel = await this.prisma.stock_levels.findFirst({
      where: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        status: 'AVAILABLE',
      },
    });

    if (!stockLevel || stockLevel.quantityAvailable < dto.quantity) {
      throw new BadRequestException(
        'Insufficient available stock for reservation',
      );
    }

    const reservation = await this.prisma.stock_reservations.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        reservedForType: dto.reservedForType,
        reservedForId: dto.reservedForId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    await this.prisma.stock_levels.update({
      where: { id: stockLevel.id },
      data: {
        quantityAvailable: { decrement: dto.quantity },
        quantityReserved: { increment: dto.quantity },
      },
    });

    await this.eventBus.publish(
      new StockReservedEvent(reservation.id, {
        inventoryItemId: dto.inventoryItemId,
        warehouseId: dto.warehouseId,
        quantity: dto.quantity,
        reservedForId: dto.reservedForId,
      }),
    );

    return reservation;
  }

  async releaseReservation(reservationId: string) {
    const reservation = await this.prisma.stock_reservations.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.isReleased) {
      throw new BadRequestException(
        `Reservation ${reservationId} invalid or already released`,
      );
    }

    const updated = await this.prisma.stock_reservations.update({
      where: { id: reservationId },
      data: { isReleased: true },
    });

    const stockLevel = await this.prisma.stock_levels.findFirst({
      where: {
        inventoryItemId: reservation.inventoryItemId,
        warehouseId: reservation.warehouseId,
        status: 'AVAILABLE',
      },
    });

    if (stockLevel) {
      await this.prisma.stock_levels.update({
        where: { id: stockLevel.id },
        data: {
          quantityAvailable: { increment: reservation.quantity },
          quantityReserved: { decrement: reservation.quantity },
        },
      });
    }

    await this.eventBus.publish(
      new StockReleasedEvent(reservationId, {
        reservationId,
        inventoryItemId: reservation.inventoryItemId,
        quantity: reservation.quantity,
      }),
    );

    return updated;
  }
}
