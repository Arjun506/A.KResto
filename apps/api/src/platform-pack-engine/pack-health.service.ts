import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { PackHealthFailedEvent } from '../event-bus/events/pack.events';

@Injectable()
export class PackHealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async reportHealth(packId: string, healthScore: number, errors?: any) {
    const pack = await this.prisma.platform_packs.findUnique({
      where: { id: packId },
    });
    if (!pack) {
      throw new NotFoundException(`Pack ${packId} not found`);
    }

    const record = await this.prisma.platform_pack_health.create({
      data: {
        packId,
        healthScore,
        errorsJson: errors,
      },
    });

    if (healthScore < 80) {
      await this.eventBus.publish(
        new PackHealthFailedEvent(packId, {
          packId,
          score: healthScore,
          errors,
        }),
      );
    }

    return record;
  }

  async getLatestHealth(packId: string) {
    return this.prisma.platform_pack_health.findFirst({
      where: { packId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
