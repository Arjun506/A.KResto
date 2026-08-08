import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  LoyaltyPointsAwardedEvent,
  LoyaltyPointsRedeemedEvent,
  LoyaltyTierChangedEvent,
} from '../../event-bus/events/crm.events';

export const TIER_THRESHOLDS = {
  PLATINUM: 2500,
  GOLD: 1000,
  SILVER: 500,
  REGULAR: 100,
  NEW: 0,
};

@Injectable()
export class LoyaltyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  calculateTier(pointsTotal: number): string {
    if (pointsTotal >= TIER_THRESHOLDS.PLATINUM) return 'PLATINUM';
    if (pointsTotal >= TIER_THRESHOLDS.GOLD) return 'GOLD';
    if (pointsTotal >= TIER_THRESHOLDS.SILVER) return 'SILVER';
    if (pointsTotal >= TIER_THRESHOLDS.REGULAR) return 'REGULAR';
    return 'NEW';
  }

  async getOrCreateLoyalty(tenantId: string, customerId: string) {
    let loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { customerId },
      include: { ledger: { orderBy: { createdAt: 'desc' }, take: 50 } },
    });

    if (!loyalty) {
      loyalty = await this.prisma.crm_loyalty.create({
        data: {
          tenantId,
          customerId,
          tier: 'NEW',
          pointsTotal: 0,
        },
        include: { ledger: true },
      });
    }

    return loyalty;
  }

  async getLoyaltyByCustomerId(customerId: string) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    return this.getOrCreateLoyalty(customer.tenantId || 'GLOBAL', customerId);
  }

  async awardPoints(loyaltyId: string, points: number, reasonCode: string, actorId?: string) {
    if (points <= 0) {
      throw new BadRequestException('Points awarded must be greater than 0');
    }

    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { id: loyaltyId },
    });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty account ${loyaltyId} not found`);
    }

    const updatedPoints = loyalty.pointsTotal + points;
    const oldTier = loyalty.tier || 'NEW';
    const newTier = this.calculateTier(updatedPoints);

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
        reasonCode: reasonCode || 'PURCHASE_BONUS',
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

    return {
      loyaltyId: updated.id,
      customerId: updated.customerId,
      pointsTotal: updated.pointsTotal,
      pointsAwarded: points,
      tier: updated.tier,
      tierChanged: newTier !== oldTier,
      previousTier: oldTier,
    };
  }

  async redeemPoints(loyaltyId: string, points: number, reasonCode: string, actorId?: string) {
    if (points <= 0) {
      throw new BadRequestException('Points redeemed must be greater than 0');
    }

    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { id: loyaltyId },
    });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty account ${loyaltyId} not found`);
    }

    if (loyalty.pointsTotal < points) {
      throw new BadRequestException(
        `Insufficient points balance. Customer has ${loyalty.pointsTotal} points, but ${points} points are required.`,
      );
    }

    const updatedPoints = loyalty.pointsTotal - points;
    const oldTier = loyalty.tier || 'NEW';
    const newTier = this.calculateTier(updatedPoints);

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
        type: 'REDEEMED',
        points: -points,
        reasonCode: reasonCode || 'REWARD_REDEMPTION',
      },
    });

    await this.eventBus.publish(
      new LoyaltyPointsRedeemedEvent(
        loyaltyId,
        { loyaltyId, points },
        updated.tenantId || undefined,
      ),
    );

    return {
      loyaltyId: updated.id,
      customerId: updated.customerId,
      pointsTotal: updated.pointsTotal,
      pointsRedeemed: points,
      tier: updated.tier,
    };
  }

  async adjustPoints(loyaltyId: string, points: number, reasonCode: string, actorId?: string) {
    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { id: loyaltyId },
    });
    if (!loyalty) {
      throw new NotFoundException(`Loyalty account ${loyaltyId} not found`);
    }

    const updatedPoints = Math.max(0, loyalty.pointsTotal + points);
    const oldTier = loyalty.tier || 'NEW';
    const newTier = this.calculateTier(updatedPoints);

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
        type: 'ADJUSTMENT',
        points,
        reasonCode: reasonCode || 'MANUAL_ADJUSTMENT',
      },
    });

    return {
      loyaltyId: updated.id,
      customerId: updated.customerId,
      pointsTotal: updated.pointsTotal,
      adjustment: points,
      tier: updated.tier,
    };
  }
}
