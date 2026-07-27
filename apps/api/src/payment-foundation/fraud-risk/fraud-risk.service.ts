import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { FraudCheckCompletedEvent } from '../../event-bus/events/payment.events';

@Injectable()
export class FraudRiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async performFraudCheck(
    paymentTransactionId: string,
    amount: number,
    ipAddress?: string,
  ) {
    let score = 10.0; // Default baseline risk score
    if (amount > 1000) {
      score += 30.0;
    }
    if (ipAddress && ipAddress.startsWith('10.')) {
      score += 15.0;
    }

    const recommendation =
      score >= 50.0 ? 'REVIEW' : score >= 80.0 ? 'REJECT' : 'APPROVE';

    const check = await this.prisma.fraud_checks.create({
      data: {
        paymentTransactionId,
        fraudScore: score,
        recommendation,
        riskFlags: { amountTrigger: amount > 1000, ipTrigger: !!ipAddress },
      },
    });

    const payment = await this.prisma.payment_transactions.findUnique({
      where: { id: paymentTransactionId },
    });

    await this.eventBus.publish(
      new FraudCheckCompletedEvent(
        check.id,
        {
          checkId: check.id,
          paymentId: paymentTransactionId,
          score,
          recommendation,
        },
        payment?.tenantId || undefined,
      ),
    );

    return check;
  }

  async getFraudChecks(paymentTransactionId: string) {
    return this.prisma.fraud_checks.findMany({
      where: { paymentTransactionId },
    });
  }
}
