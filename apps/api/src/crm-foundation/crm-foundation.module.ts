import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';

import { LeadsService } from './leads/leads.service';
import { LeadsController } from './leads/leads.controller';

import { OpportunitiesService } from './opportunities/opportunities.service';
import { OpportunitiesController } from './opportunities/opportunities.controller';

import { CrmCasesService } from './cases/crm-cases.service';
import { CrmCasesController } from './cases/crm-cases.controller';

import { CrmInteractionsService } from './interactions/crm-interactions.service';
import { CrmInteractionsController } from './interactions/crm-interactions.controller';

import { Customer360Service } from './customer-360/customer-360.service';
import { Customer360Controller } from './customer-360/customer-360.controller';

import { ConsentPrivacyService } from './consent-privacy/consent-privacy.service';
import { ConsentPrivacyController } from './consent-privacy/consent-privacy.controller';

import { LoyaltyService } from './loyalty/loyalty.service';
import { LoyaltyController } from './loyalty/loyalty.controller';

import { SupportTicketsService } from './support-tickets/support-tickets.service';
import { SupportTicketsController } from './support-tickets/support-tickets.controller';

import { CampaignAutomationService } from './campaign-automation/campaign-automation.service';
import { CampaignAutomationController } from './campaign-automation/campaign-automation.controller';

import { FeedbackSurveysService } from './feedback-surveys/feedback-surveys.service';
import { FeedbackSurveysController } from './feedback-surveys/feedback-surveys.controller';

import { CustomerIdentityMergeService } from './identity-merge/identity-merge.service';
import { CustomerIdentityMergeController } from './identity-merge/identity-merge.controller';

import { CrmLookupController } from './lookups/crm-lookup.controller';

@Module({
  imports: [EventBusModule],
  controllers: [
    LeadsController,
    OpportunitiesController,
    CrmCasesController,
    CrmInteractionsController,
    Customer360Controller,
    ConsentPrivacyController,
    LoyaltyController,
    SupportTicketsController,
    CampaignAutomationController,
    FeedbackSurveysController,
    CustomerIdentityMergeController,
    CrmLookupController,
  ],
  providers: [
    LeadsService,
    OpportunitiesService,
    CrmCasesService,
    CrmInteractionsService,
    Customer360Service,
    ConsentPrivacyService,
    LoyaltyService,
    SupportTicketsService,
    CampaignAutomationService,
    FeedbackSurveysService,
    CustomerIdentityMergeService,
  ],
  exports: [
    LeadsService,
    OpportunitiesService,
    CrmCasesService,
    CrmInteractionsService,
    Customer360Service,
    ConsentPrivacyService,
    LoyaltyService,
    SupportTicketsService,
    CampaignAutomationService,
    FeedbackSurveysService,
    CustomerIdentityMergeService,
  ],
})
export class CrmFoundationModule {}
