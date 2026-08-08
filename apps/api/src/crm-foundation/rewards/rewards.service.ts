import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  pointsCost!: number;

  @IsNumber()
  discountValue!: number;

  @IsOptional()
  @IsString()
  discountType?: 'FIXED' | 'PERCENTAGE';

  @IsOptional()
  @IsString()
  minTier?: string;
}

@Injectable()
export class RewardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  async createReward(tenantId: string, dto: CreateRewardDto) {
    if (!dto.name || !dto.pointsCost || dto.pointsCost <= 0) {
      throw new BadRequestException('Reward name and valid points cost (> 0) are required');
    }

    return this.prisma.customer_rewards.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        pointsCost: Number(dto.pointsCost),
        discountValue: Number(dto.discountValue || 0),
        discountType: dto.discountType || 'FIXED',
        minTier: dto.minTier || 'NEW',
        isActive: true,
      },
    });
  }

  async getRewards(tenantId: string) {
    return this.prisma.customer_rewards.findMany({
      where: { tenantId, isActive: true },
      orderBy: { pointsCost: 'asc' },
    });
  }

  async redeemReward(tenantId: string, customerId: string, rewardId: string, actorId?: string) {
    const reward = await this.prisma.customer_rewards.findFirst({
      where: { id: rewardId, tenantId, isActive: true },
    });
    if (!reward) {
      throw new NotFoundException(`Reward ${rewardId} not found or inactive for tenant`);
    }

    const loyalty = await this.loyaltyService.getOrCreateLoyalty(tenantId, customerId);

    if (loyalty.pointsTotal < reward.pointsCost) {
      throw new BadRequestException(
        `Insufficient points to redeem ${reward.name}. Required: ${reward.pointsCost}, Available: ${loyalty.pointsTotal}`,
      );
    }

    // Deduct loyalty points
    await this.loyaltyService.redeemPoints(
      loyalty.id,
      reward.pointsCost,
      `REWARD_REDEMPTION:${reward.name}`,
      actorId,
    );

    // Generate Coupon Code
    const couponCode = `RWD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const redemption = await this.prisma.customer_reward_redemptions.create({
      data: {
        tenantId,
        customerId,
        rewardId,
        pointsSpent: reward.pointsCost,
        couponCode,
        status: 'ACTIVE',
      },
      include: { reward: true },
    });

    return {
      redemptionId: redemption.id,
      rewardName: reward.name,
      couponCode,
      pointsSpent: reward.pointsCost,
      status: redemption.status,
      redeemedAt: redemption.redeemedAt,
    };
  }

  async getRedemptions(tenantId: string, customerId: string) {
    return this.prisma.customer_reward_redemptions.findMany({
      where: { tenantId, customerId },
      include: { reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
  }
}
