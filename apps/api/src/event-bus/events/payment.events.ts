import { DomainEvent } from '../domain-event.interface';

export class PaymentIntentCreatedEvent implements DomainEvent<{
  intentId: string;
  intentNumber: string;
  amount: number;
}> {
  readonly eventName = 'payment.intent.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      intentId: string;
      intentNumber: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentCreatedEvent implements DomainEvent<{
  paymentId: string;
  paymentNumber: string;
  amount: number;
}> {
  readonly eventName = 'payment.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      paymentId: string;
      paymentNumber: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentAuthorizedEvent implements DomainEvent<{
  paymentId: string;
  amount: number;
}> {
  readonly eventName = 'payment.authorized';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string; amount: number },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentCapturedEvent implements DomainEvent<{
  paymentId: string;
  amount: number;
}> {
  readonly eventName = 'payment.captured';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string; amount: number },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentFailedEvent implements DomainEvent<{
  paymentId: string;
  reason: string;
}> {
  readonly eventName = 'payment.failed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string; reason: string },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentCancelledEvent implements DomainEvent<{
  paymentId: string;
}> {
  readonly eventName = 'payment.cancelled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentRetriedEvent implements DomainEvent<{
  paymentId: string;
  attemptNumber: number;
}> {
  readonly eventName = 'payment.retried';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string; attemptNumber: number },
    public readonly tenantId?: string,
  ) {}
}

export class PaymentVoidedEvent implements DomainEvent<{ paymentId: string }> {
  readonly eventName = 'payment.voided';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { paymentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class RefundCreatedEvent implements DomainEvent<{
  refundId: string;
  paymentId: string;
  amount: number;
}> {
  readonly eventName = 'payment.refund.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      refundId: string;
      paymentId: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class RefundCompletedEvent implements DomainEvent<{
  refundId: string;
  paymentId: string;
  amount: number;
}> {
  readonly eventName = 'payment.refund.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      refundId: string;
      paymentId: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ChargebackOpenedEvent implements DomainEvent<{
  disputeId: string;
  paymentId: string;
  amount: number;
}> {
  readonly eventName = 'payment.dispute.opened';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      disputeId: string;
      paymentId: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ChargebackResolvedEvent implements DomainEvent<{
  disputeId: string;
  status: string;
}> {
  readonly eventName = 'payment.dispute.resolved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { disputeId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class SettlementStartedEvent implements DomainEvent<{
  batchId: string;
  amount: number;
}> {
  readonly eventName = 'payment.settlement.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { batchId: string; amount: number },
    public readonly tenantId?: string,
  ) {}
}

export class SettlementCompletedEvent implements DomainEvent<{
  batchId: string;
  status: string;
}> {
  readonly eventName = 'payment.settlement.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { batchId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class SettlementReconciledEvent implements DomainEvent<{
  reconciliationId: string;
  providerCode: string;
}> {
  readonly eventName = 'payment.settlement.reconciled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { reconciliationId: string; providerCode: string },
    public readonly tenantId?: string,
  ) {}
}

export class WalletCreditedEvent implements DomainEvent<{
  walletId: string;
  amount: number;
  balance: number;
}> {
  readonly eventName = 'payment.wallet.credited';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      walletId: string;
      amount: number;
      balance: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class WalletDebitedEvent implements DomainEvent<{
  walletId: string;
  amount: number;
  balance: number;
}> {
  readonly eventName = 'payment.wallet.debited';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      walletId: string;
      amount: number;
      balance: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class GiftCardIssuedEvent implements DomainEvent<{
  giftCardId: string;
  cardNumber: string;
  amount: number;
}> {
  readonly eventName = 'payment.giftcard.issued';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      giftCardId: string;
      cardNumber: string;
      amount: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class GiftCardRedeemedEvent implements DomainEvent<{
  giftCardId: string;
  amount: number;
  balance: number;
}> {
  readonly eventName = 'payment.giftcard.redeemed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      giftCardId: string;
      amount: number;
      balance: number;
    },
    public readonly tenantId?: string,
  ) {}
}

export class SplitPaymentCreatedEvent implements DomainEvent<{
  paymentId: string;
  splits: Array<{ type: string; amount: number }>;
}> {
  readonly eventName = 'payment.split.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      paymentId: string;
      splits: Array<{ type: string; amount: number }>;
    },
    public readonly tenantId?: string,
  ) {}
}

export class FraudCheckCompletedEvent implements DomainEvent<{
  checkId: string;
  paymentId: string;
  score: number;
  recommendation: string;
}> {
  readonly eventName = 'payment.fraud_check.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      checkId: string;
      paymentId: string;
      score: number;
      recommendation: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class GatewayHealthChangedEvent implements DomainEvent<{
  providerCode: string;
  availability: number;
  latencyMs: number;
}> {
  readonly eventName = 'payment.gateway.health.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      providerCode: string;
      availability: number;
      latencyMs: number;
    },
    public readonly tenantId?: string,
  ) {}
}
