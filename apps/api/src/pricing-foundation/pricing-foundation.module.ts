import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Controllers
import { PriceBooksController } from './price-books/price-books.controller';
import { PricingVersioningController } from './versioning/pricing-versioning.controller';
import { PricingWorkflowController } from './approval-workflow/pricing-workflow.controller';
import { PricingAuditSnapshotController } from './audit-snapshots/pricing-audit-snapshot.controller';
import { PricingStrategyController } from './pricing-strategies/pricing-strategy.controller';
import { PricingSimulationController } from './simulation-engine/pricing-simulation.controller';
import { PricingConflictResolutionController } from './conflict-resolution/pricing-conflict-resolution.controller';
import { PricingFormulaController } from './formula-engine/pricing-formula.controller';
import { CouponsController } from './coupons/coupons.controller';
import { CurrenciesController } from './currencies/currencies.controller';
import { PriceRulesController } from './price-rules/price-rules.controller';
import { PricingOverridesController } from './overrides/pricing-overrides.controller';
import { TierPricingController } from './tiers/tier-pricing.controller';
import { PriceCalculationController } from './calculation-engine/price-calculation.controller';
import { PricingCalendarsController } from './effective-calendars/pricing-calendars.controller';
import { PricingLookupController } from './lookups/pricing-lookup.controller';

// Services & Repositories
import { PriceBooksService } from './price-books/price-books.service';
import { PriceBooksRepository } from './price-books/price-books.repository';
import { PricingVersioningService } from './versioning/pricing-versioning.service';
import { PricingWorkflowService } from './approval-workflow/pricing-workflow.service';
import { PricingAuditSnapshotService } from './audit-snapshots/pricing-audit-snapshot.service';
import { PricingStrategyService } from './pricing-strategies/pricing-strategy.service';
import { PricingSimulationService } from './simulation-engine/pricing-simulation.service';
import { PricingConflictResolutionService } from './conflict-resolution/pricing-conflict-resolution.service';
import { PricingFormulaService } from './formula-engine/pricing-formula.service';
import { CouponsService } from './coupons/coupons.service';
import { CurrenciesService } from './currencies/currencies.service';
import { PriceRulesService } from './price-rules/price-rules.service';
import { PricingOverridesService } from './overrides/pricing-overrides.service';
import { TierPricingService } from './tiers/tier-pricing.service';
import { PriceCalculationService } from './calculation-engine/price-calculation.service';
import { PricingCalendarsService } from './effective-calendars/pricing-calendars.service';
import { PricingLookupService } from './lookups/pricing-lookup.service';

@Module({
  controllers: [
    PriceBooksController,
    PricingVersioningController,
    PricingWorkflowController,
    PricingAuditSnapshotController,
    PricingStrategyController,
    PricingSimulationController,
    PricingConflictResolutionController,
    PricingFormulaController,
    CouponsController,
    CurrenciesController,
    PriceRulesController,
    PricingOverridesController,
    TierPricingController,
    PriceCalculationController,
    PricingCalendarsController,
    PricingLookupController,
  ],
  providers: [PriceBooksService,
    PriceBooksRepository,
    PricingVersioningService,
    PricingWorkflowService,
    PricingAuditSnapshotService,
    PricingStrategyService,
    PricingSimulationService,
    PricingConflictResolutionService,
    PricingFormulaService,
    CouponsService,
    CurrenciesService,
    PriceRulesService,
    PricingOverridesService,
    TierPricingService,
    PriceCalculationService,
    PricingCalendarsService,
    PricingLookupService],
  exports: [
    PriceBooksService,
    PricingVersioningService,
    PricingWorkflowService,
    PricingAuditSnapshotService,
    PricingStrategyService,
    PricingSimulationService,
    PricingConflictResolutionService,
    PricingFormulaService,
    CouponsService,
    CurrenciesService,
    PriceRulesService,
    PricingOverridesService,
    TierPricingService,
    PriceCalculationService,
    PricingCalendarsService,
    PricingLookupService,
  ],
})
export class PricingFoundationModule {}
