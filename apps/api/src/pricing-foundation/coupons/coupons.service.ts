import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto } from './create-coupon.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CouponCreatedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class CouponsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createCoupon(tenantId: string | undefined, dto: CreateCouponDto) {
    const coupon = await this.prisma.coupons.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        type: dto.type,
        value: dto.value,
        minSpend: dto.minSpend,
        usageLimit: dto.usageLimit,
      },
    });

    await this.eventBus.publish(
      new CouponCreatedEvent(
        coupon.id,
        { couponId: coupon.id, code: coupon.code, value: coupon.value },
        tenantId,
      ),
    );

    return coupon;
  }

  async listCoupons(tenantId?: string) {
    return this.prisma.coupons.findMany({
      where: tenantId ? { tenantId, deletedAt: null } : { deletedAt: null },
    });
  }

  async getCouponByCode(code: string) {
    return this.prisma.coupons.findFirst({
      where: { code, deletedAt: null },
    });
  }
}
