import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  LoyaltyPointsAwardedEvent,
  LoyaltyPointsRedeemedEvent,
  LoyaltyTierChangedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async getOrCreateLoyalty(tenantId: string, customerId: string) {
    let loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { customerId },
    });

    if (!loyalty) {
      loyalty = await this.prisma.crm_loyalty.create({
        data: {
          tenantId,
          customerId,
          tier: 'BRONZE',
          pointsTotal: 0,
        },
      });
    }

    return loyalty;
  }

  async awardPoints(loyaltyId: string, points: number, reasonCode: string) {
    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { id: loyaltyId },
    });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty ${loyaltyId} not found`);
    }

    const updatedPoints = loyalty.pointsTotal + points;
    const oldTier = loyalty.tier;
    let newTier = oldTier;

    if (updatedPoints >= 1000) {
      newTier = 'GOLD';
    } else if (updatedPoints >= 500) {
      newTier = 'SILVER';
    }

    const updated = await this.prisma.crm_loyalty.update({
      where: { id: loyaltyId },
      data: {
        pointsTotal: updatedPoints,
        tier: newTier,
      },
    });

    await this.prisma.crm_loyalty_ledger.create({
      data: {
        loyaltyId,
        type: 'EARNED',
        points,
        reasonCode,
      },
    });

    await this.eventBus.publish(
      new LoyaltyPointsAwardedEvent(
        loyaltyId,
        { loyaltyId, points },
        updated.tenantId || undefined,
      ),
    );

    if (newTier !== oldTier) {
      await this.eventBus.publish(
        new LoyaltyTierChangedEvent(
          loyaltyId,
          { loyaltyId, oldTier, newTier },
          updated.tenantId || undefined,
        ),
      );
    }

    return updated;
  }

  async redeemPoints(loyaltyId: string, points: number, reasonCode: string) {
    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { id: loyaltyId },
    });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty ${loyaltyId} not found`);
    }

    const updatedPoints = Math.max(0, loyalty.pointsTotal - points);

    const updated = await this.prisma.crm_loyalty.update({
      where: { id: loyaltyId },
      data: {
        pointsTotal: updatedPoints,
      },
    });

    await this.prisma.crm_loyalty_ledger.create({
      data: {
        loyaltyId,
        type: 'REDEEMED',
        points,
        reasonCode,
      },
    });

    await this.eventBus.publish(
      new LoyaltyPointsRedeemedEvent(
        loyaltyId,
        { loyaltyId, points },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }
}
