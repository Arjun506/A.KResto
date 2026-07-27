import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { GatewayHealthChangedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class GatewayHealthMonitorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async trackHealth(providerCode: string, success: boolean, latencyMs: number) {
    const existing = await this.prisma.provider_health_metrics.findUnique({
      where: { providerCode },
    });

    const currentSuccess = success ? 100 : 0;
    const nextAvailability = existing
      ? (existing.availabilityPercent * 9 + currentSuccess) / 10
      : currentSuccess;
    const nextLatency = existing
      ? (existing.latencyMs * 9 + latencyMs) / 10
      : latencyMs;
    const nextFailRate = 100 - nextAvailability;

    const metric = await this.prisma.provider_health_metrics.upsert({
      where: { providerCode },
      create: {
        providerCode,
        availabilityPercent: nextAvailability,
        latencyMs: nextLatency,
        failureRatePercent: nextFailRate,
        successRatePercent: nextAvailability,
      },
      update: {
        availabilityPercent: nextAvailability,
        latencyMs: nextLatency,
        failureRatePercent: nextFailRate,
        successRatePercent: nextAvailability,
      },
    });

    await this.eventBus.publish(
      new GatewayHealthChangedEvent(providerCode, {
        providerCode,
        availability: nextAvailability,
        latencyMs: nextLatency,
      }),
    );

    return metric;
  }

  async getMetrics() {
    return this.prisma.provider_health_metrics.findMany({
      orderBy: { providerCode: 'asc' },
    });
  }
}
