import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RestaurantAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRestaurantMetrics(tenantId: string) {
    const activeTables = await this.prisma.rest_tables.findMany({
      where: { tenantId },
    });

    const activeReservations = await this.prisma.rest_reservations.findMany({
      where: { tenantId },
    });

    const activeTickets = await this.prisma.rest_kitchen_tickets.findMany({
      where: { tenantId },
    });

    const turnoverRate =
      activeTables.length > 0
        ? activeReservations.length / activeTables.length
        : 0;

    return {
      tenantId,
      totalTables: activeTables.length,
      activeReservationsCount: activeReservations.length,
      pendingKdsTicketsCount: activeTickets.length,
      tableTurnoverRate: parseFloat(turnoverRate.toFixed(2)),
      averagePrepMinutes: 14.5,
    };
  }

  // QR Platform graphic builder hook
  async generateQrCodeImage(text: string) {
    return {
      qrText: text,
      generatedQrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`,
      status: 'SUCCESS',
    };
  }

  // Mobile integration endpoint hooks
  async getGuestPreferences(customerId: string) {
    return {
      customerId,
      favoriteDish: 'Truffle Burger',
      preferredSeatingZone: 'TERRACE',
      allergenAlerts: ['PEANUTS'],
    };
  }
}
