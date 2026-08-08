import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoyaltyService } from '../loyalty/loyalty.service';

@Injectable()
export class ReferralsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  async getOrCreateReferralCode(tenantId: string, customerId: string) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      include: { profile: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    let existing = await this.prisma.customer_referrals.findFirst({
      where: { tenantId, referrerCustomerId: customerId },
    });

    if (!existing) {
      const codeBase = (customer.profile?.firstName || 'CUST').replace(/\s+/g, '').toUpperCase();
      const referralCode = `REF-${codeBase}-${Math.floor(100 + Math.random() * 900)}`;

      existing = await this.prisma.customer_referrals.create({
        data: {
          tenantId,
          referrerCustomerId: customerId,
          referralCode,
          status: 'PENDING',
          rewardPoints: 100,
        },
      });
    }

    return existing;
  }

  async claimReferral(tenantId: string, referralCode: string, referredCustomerId: string) {
    const referral = await this.prisma.customer_referrals.findFirst({
      where: { tenantId, referralCode: referralCode.trim().toUpperCase() },
    });

    if (!referral) {
      throw new NotFoundException(`Invalid referral code ${referralCode}`);
    }

    if (referral.referrerCustomerId === referredCustomerId) {
      throw new BadRequestException('Customers cannot refer themselves');
    }

    // Award 100 bonus points to referrer
    const referrerLoyalty = await this.loyaltyService.getOrCreateLoyalty(tenantId, referral.referrerCustomerId);
    await this.loyaltyService.awardPoints(
      referrerLoyalty.id,
      referral.rewardPoints,
      `REFERRAL_BONUS:Referred ${referredCustomerId}`,
    );

    // Award 50 bonus points to newly referred customer
    const referredLoyalty = await this.loyaltyService.getOrCreateLoyalty(tenantId, referredCustomerId);
    await this.loyaltyService.awardPoints(
      referredLoyalty.id,
      50,
      `REFERRAL_SIGNUP_BONUS`,
    );

    const updated = await this.prisma.customer_referrals.update({
      where: { id: referral.id },
      data: {
        referredCustomerId,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return {
      referralId: updated.id,
      status: updated.status,
      referrerCustomerId: updated.referrerCustomerId,
      referredCustomerId: updated.referredCustomerId,
      bonusAwarded: referral.rewardPoints,
    };
  }
}
