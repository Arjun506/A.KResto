import { Injectable } from '@nestjs/common';
import { PlanTier } from '@prisma/client';

@Injectable()
export class SubscriptionProvisioner {
  provisionSubscription(
    tx: any,

    input: {
      tenantId: string;
      billingEmail: string;
      plan: PlanTier;
    },
  ) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

    return (
      tx as { subscriptions: { create: (args: any) => any } }
    ).subscriptions.create({
      data: {
        restaurantId: input.tenantId,
        planName: input.plan,
        status: 'TRIALING',
        billingEmail: input.billingEmail,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
      },
    });
  }
}
