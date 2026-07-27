import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';
import { AuditModule } from '../audit/audit.module';

import { TransactionsService } from './transactions/transactions.service';
import { TransactionsController } from './transactions/transactions.controller';

import { OrderRegistryRepository } from './registry/order-registry.repository';
import { OrderRegistryService } from './registry/order-registry.service';
import { OrderRegistryController } from './registry/order-registry.controller';

import { OrderTypesService } from './types/order-types.service';
import { OrderTypesController } from './types/order-types.controller';

import { OrderLifecycleService } from './lifecycle/order-lifecycle.service';
import { OrderLifecycleController } from './lifecycle/order-lifecycle.controller';

import { LineItemsService } from './line-items/line-items.service';
import { LineItemsController } from './line-items/line-items.controller';

import { OrderCalculationSnapshotsService } from './calculation-snapshots/order-calculation-snapshots.service';
import { OrderCalculationSnapshotsController } from './calculation-snapshots/order-calculation-snapshots.controller';

import { FulfillmentExecutionService } from './fulfillment-execution/fulfillment-execution.service';
import { FulfillmentExecutionController } from './fulfillment-execution/fulfillment-execution.controller';

import { OrderShipmentsService } from './shipments/order-shipments.service';
import { OrderShipmentsController } from './shipments/order-shipments.controller';

import { SmartRoutingService } from './smart-routing/smart-routing.service';
import { SmartRoutingController } from './smart-routing/smart-routing.controller';

import { ReturnsRefundsService } from './returns-refunds/returns-refunds.service';
import { ReturnsRefundsController } from './returns-refunds/returns-refunds.controller';

import { OrderSlaService } from './sla-engine/order-sla.service';
import { OrderSlaController } from './sla-engine/order-sla.controller';

import { OrderCancellationService } from './cancellation/order-cancellation.service';
import { OrderCancellationController } from './cancellation/order-cancellation.controller';

import { TransactionLedgerService } from './ledger/transaction-ledger.service';
import { TransactionLedgerController } from './ledger/transaction-ledger.controller';

import { OrderApprovalWorkflowService } from './approval-workflow/order-approval-workflow.service';
import { OrderApprovalWorkflowController } from './approval-workflow/order-approval-workflow.controller';

import { OrderVersioningService } from './versioning/order-versioning.service';
import { OrderVersioningController } from './versioning/order-versioning.controller';

import { OrderNotesService } from './notes/order-notes.service';
import { OrderNotesController } from './notes/order-notes.controller';

import { OrderTagsService } from './tags/order-tags.service';
import { OrderTagsController } from './tags/order-tags.controller';

import { OrderLookupService } from './lookups/order-lookup.service';
import { OrderLookupController } from './lookups/order-lookup.controller';

@Module({
  imports: [EventBusModule, AuditModule],
  controllers: [
    TransactionsController,
    OrderRegistryController,
    OrderTypesController,
    OrderLifecycleController,
    LineItemsController,
    OrderCalculationSnapshotsController,
    FulfillmentExecutionController,
    OrderShipmentsController,
    SmartRoutingController,
    ReturnsRefundsController,
    OrderSlaController,
    OrderCancellationController,
    TransactionLedgerController,
    OrderApprovalWorkflowController,
    OrderVersioningController,
    OrderNotesController,
    OrderTagsController,
    OrderLookupController,
  ],
  providers: [
    PrismaService,
    TransactionsService,
    OrderRegistryRepository,
    OrderRegistryService,
    OrderTypesService,
    OrderLifecycleService,
    LineItemsService,
    OrderCalculationSnapshotsService,
    FulfillmentExecutionService,
    OrderShipmentsService,
    SmartRoutingService,
    ReturnsRefundsService,
    OrderSlaService,
    OrderCancellationService,
    TransactionLedgerService,
    OrderApprovalWorkflowService,
    OrderVersioningService,
    OrderNotesService,
    OrderTagsService,
    OrderLookupService,
  ],
  exports: [
    TransactionsService,
    OrderRegistryService,
    OrderLifecycleService,
    FulfillmentExecutionService,
    OrderShipmentsService,
    ReturnsRefundsService,
  ],
})
export class OrderFoundationModule {}
