import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { PaymentIntentService } from './intents/payment-intent.service';
import { PaymentIntentController } from './intents/payment-intent.controller';

import { TokenVaultService } from './token-vault/payment-tokens.service';
import { PaymentTokensController } from './token-vault/payment-tokens.controller';

import { SubscriptionBillingService } from './subscription-billing/subscription-billing.service';
import { SubscriptionBillingController } from './subscription-billing/subscription-billing.controller';

import { PaymentDisputesService } from './disputes/payment-disputes.service';
import { PaymentDisputesController } from './disputes/payment-disputes.controller';

import { GatewayHealthMonitorService } from './health-monitor/health-monitor.service';
import { GatewayHealthMonitorController } from './health-monitor/health-monitor.controller';

import { PaymentRegistryService } from './registry/payment-registry.service';
import { PaymentRegistryController } from './registry/payment-registry.controller';

import { PaymentMethodsService } from './methods/payment-methods.service';
import { PaymentMethodsController } from './methods/payment-methods.controller';

import { PaymentProvidersService } from './providers/payment-providers.service';
import { PaymentProvidersController } from './providers/payment-providers.controller';

import {
  MockGatewayAdapter,
  GatewayAdapterFactory,
} from './gateway-abstraction/gateway-adapter.factory';

import { PaymentAuthorizationService } from './authorization-engine/payment-authorization.service';
import { PaymentAuthorizationController } from './authorization-engine/payment-authorization.controller';

import { PaymentCaptureService } from './capture-engine/payment-capture.service';
import { PaymentCaptureController } from './capture-engine/payment-capture.controller';

import { PaymentSettlementService } from './settlement-engine/payment-settlement.service';
import { PaymentSettlementController } from './settlement-engine/payment-settlement.controller';

import { PaymentRefundService } from './refund-engine/payment-refund.service';
import { PaymentRefundController } from './refund-engine/payment-refund.controller';

import { PaymentVoidService } from './void-engine/payment-void.service';
import { PaymentVoidController } from './void-engine/payment-void.controller';

import { WalletFoundationService } from './wallet-foundation/wallet-foundation.service';
import { WalletFoundationController } from './wallet-foundation/wallet-foundation.controller';

import { GiftCardService } from './gift-card-foundation/gift-card.service';
import { GiftCardController } from './gift-card-foundation/gift-card.controller';

import { SplitPaymentService } from './split-payments/split-payments.service';
import { SplitPaymentController } from './split-payments/split-payments.controller';

import { FraudRiskService } from './fraud-risk/fraud-risk.service';
import { FraudRiskController } from './fraud-risk/fraud-risk.controller';

import { PaymentLookupController } from './lookups/payment-lookup.controller';

@Module({
  imports: [EventBusModule],
  controllers: [
    PaymentIntentController,
    PaymentTokensController,
    SubscriptionBillingController,
    PaymentDisputesController,
    GatewayHealthMonitorController,
    PaymentRegistryController,
    PaymentMethodsController,
    PaymentProvidersController,
    PaymentAuthorizationController,
    PaymentCaptureController,
    PaymentSettlementController,
    PaymentRefundController,
    PaymentVoidController,
    WalletFoundationController,
    GiftCardController,
    SplitPaymentController,
    FraudRiskController,
    PaymentLookupController,
  ],
  providers: [PaymentIntentService,
    TokenVaultService,
    SubscriptionBillingService,
    PaymentDisputesService,
    GatewayHealthMonitorService,
    PaymentRegistryService,
    PaymentMethodsService,
    PaymentProvidersService,
    MockGatewayAdapter,
    GatewayAdapterFactory,
    PaymentAuthorizationService,
    PaymentCaptureService,
    PaymentSettlementService,
    PaymentRefundService,
    PaymentVoidService,
    WalletFoundationService,
    GiftCardService,
    SplitPaymentService,
    FraudRiskService],
  exports: [
    PaymentIntentService,
    TokenVaultService,
    SubscriptionBillingService,
    PaymentDisputesService,
    GatewayHealthMonitorService,
    PaymentRegistryService,
    PaymentAuthorizationService,
    PaymentCaptureService,
    PaymentSettlementService,
    PaymentRefundService,
    PaymentVoidService,
    WalletFoundationService,
    GiftCardService,
    SplitPaymentService,
    FraudRiskService,
  ],
})
export class PaymentFoundationModule {}
