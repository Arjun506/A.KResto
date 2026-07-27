import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionBillingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBillingSchedule(
    tenantId: string,
    customerId: string,
    amount: number,
    frequency: string = 'MONTHLY',
  ) {
    const nextBillingAt = new Date();
    if (frequency === 'MONTHLY') {
      nextBillingAt.setMonth(nextBillingAt.getMonth() + 1);
    } else {
      nextBillingAt.setDate(nextBillingAt.getDate() + 7);
    }

    return this.prisma.billing_schedules.create({
      data: {
        tenantId,
        customerId,
        amount,
        frequency,
        nextBillingAt,
        status: 'ACTIVE',
      },
    });
  }

  async triggerBillingSchedule(id: string) {
    const schedule = await this.prisma.billing_schedules.findUnique({
      where: { id },
    });
    if (!schedule) {
      throw new Error(`Schedule ${id} not found`);
    }

    // Trigger mock billing payment execution logic
    const nextBilling = new Date(schedule.nextBillingAt);
    if (schedule.frequency === 'MONTHLY') {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else {
      nextBilling.setDate(nextBilling.getDate() + 7);
    }

    return this.prisma.billing_schedules.update({
      where: { id },
      data: { nextBillingAt: nextBilling },
    });
  }

  async getCustomerSchedules(customerId: string) {
    return this.prisma.billing_schedules.findMany({
      where: { customerId },
    });
  }
}
