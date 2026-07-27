import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustCapabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveCapabilities() {
    const packs = await this.prisma.platform_packs.findMany({
      where: { status: 'ACTIVE' },
    });

    const capabilities: string[] = [];
    packs.forEach((pack) => {
      if (pack.code === 'rest-pack' || pack.code === 'restaurant') {
        capabilities.push('food-ordering', 'table-booking', 'kitchen-kds');
      }
      if (pack.code === 'hotel-pack') {
        capabilities.push('room-booking', 'room-service');
      }
    });

    // Provide default fallback capabilities if no packs are active
    if (capabilities.length === 0) {
      capabilities.push('standard-catalog', 'order-tracking');
    }

    return {
      activePacks: packs.map((p) => p.code),
      capabilities,
    };
  }
}
