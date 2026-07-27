import { DomainEvent } from '../domain-event.interface';

export class LeadCreatedEvent implements DomainEvent<{
  leadId: string;
  leadNumber: string;
}> {
  readonly eventName = 'crm.lead.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { leadId: string; leadNumber: string },
    public readonly tenantId?: string,
  ) {}
}

export class LeadQualifiedEvent implements DomainEvent<{
  leadId: string;
  customerId: string;
}> {
  readonly eventName = 'crm.lead.qualified';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { leadId: string; customerId: string },
    public readonly tenantId?: string,
  ) {}
}

export class OpportunityCreatedEvent implements DomainEvent<{
  opportunityId: string;
  title: string;
}> {
  readonly eventName = 'crm.opportunity.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { opportunityId: string; title: string },
    public readonly tenantId?: string,
  ) {}
}

export class OpportunityWonEvent implements DomainEvent<{
  opportunityId: string;
  estimatedValue: number;
}> {
  readonly eventName = 'crm.opportunity.won';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { opportunityId: string; estimatedValue: number },
    public readonly tenantId?: string,
  ) {}
}

export class OpportunityLostEvent implements DomainEvent<{
  opportunityId: string;
  reason?: string;
}> {
  readonly eventName = 'crm.opportunity.lost';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { opportunityId: string; reason?: string },
    public readonly tenantId?: string,
  ) {}
}

export class CampaignCreatedEvent implements DomainEvent<{
  campaignId: string;
  name: string;
}> {
  readonly eventName = 'crm.campaign.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { campaignId: string; name: string },
    public readonly tenantId?: string,
  ) {}
}

export class CampaignLaunchedEvent implements DomainEvent<{
  campaignId: string;
}> {
  readonly eventName = 'crm.campaign.launched';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { campaignId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CampaignCompletedEvent implements DomainEvent<{
  campaignId: string;
}> {
  readonly eventName = 'crm.campaign.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { campaignId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CommunicationSentEvent implements DomainEvent<{
  customerId: string;
  channel: string;
}> {
  readonly eventName = 'crm.communication.sent';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; channel: string },
    public readonly tenantId?: string,
  ) {}
}

export class LoyaltyPointsAwardedEvent implements DomainEvent<{
  loyaltyId: string;
  points: number;
}> {
  readonly eventName = 'crm.loyalty.awarded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { loyaltyId: string; points: number },
    public readonly tenantId?: string,
  ) {}
}

export class LoyaltyPointsRedeemedEvent implements DomainEvent<{
  loyaltyId: string;
  points: number;
}> {
  readonly eventName = 'crm.loyalty.redeemed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { loyaltyId: string; points: number },
    public readonly tenantId?: string,
  ) {}
}

export class LoyaltyTierChangedEvent implements DomainEvent<{
  loyaltyId: string;
  oldTier: string;
  newTier: string;
}> {
  readonly eventName = 'crm.loyalty.tier.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      loyaltyId: string;
      oldTier: string;
      newTier: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class SupportTicketCreatedEvent implements DomainEvent<{
  ticketId: string;
  ticketNumber: string;
}> {
  readonly eventName = 'crm.ticket.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { ticketId: string; ticketNumber: string },
    public readonly tenantId?: string,
  ) {}
}

export class SupportTicketAssignedEvent implements DomainEvent<{
  ticketId: string;
  assignedTo: string;
}> {
  readonly eventName = 'crm.ticket.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { ticketId: string; assignedTo: string },
    public readonly tenantId?: string,
  ) {}
}

export class SupportTicketResolvedEvent implements DomainEvent<{
  ticketId: string;
}> {
  readonly eventName = 'crm.ticket.resolved';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { ticketId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerSegmentChangedEvent implements DomainEvent<{
  customerId: string;
  segmentCode: string;
}> {
  readonly eventName = 'crm.segment.changed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; segmentCode: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerJourneyUpdatedEvent implements DomainEvent<{
  customerId: string;
  milestone: string;
}> {
  readonly eventName = 'crm.journey.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; milestone: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerPreferenceUpdatedEvent implements DomainEvent<{
  customerId: string;
  type: string;
}> {
  readonly eventName = 'crm.preference.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; type: string },
    public readonly tenantId?: string,
  ) {}
}

export class FeedbackReceivedEvent implements DomainEvent<{
  feedbackId: string;
  score: number;
}> {
  readonly eventName = 'crm.feedback.received';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { feedbackId: string; score: number },
    public readonly tenantId?: string,
  ) {}
}

export class SurveyCompletedEvent implements DomainEvent<{
  surveyId: string;
  score: number;
}> {
  readonly eventName = 'crm.survey.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { surveyId: string; score: number },
    public readonly tenantId?: string,
  ) {}
}

export class RelationshipLinkedEvent implements DomainEvent<{
  fromId: string;
  toId: string;
  type: string;
}> {
  readonly eventName = 'crm.relationship.linked';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { fromId: string; toId: string; type: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerScoreUpdatedEvent implements DomainEvent<{
  customerId: string;
  score: number;
}> {
  readonly eventName = 'crm.score.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string; score: number },
    public readonly tenantId?: string,
  ) {}
}

export class CaseCreatedEvent implements DomainEvent<{
  caseId: string;
  caseNumber: string;
}> {
  readonly eventName = 'crm.case.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { caseId: string; caseNumber: string },
    public readonly tenantId?: string,
  ) {}
}

export class CaseEscalatedEvent implements DomainEvent<{
  caseId: string;
  priority: string;
}> {
  readonly eventName = 'crm.case.escalated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { caseId: string; priority: string },
    public readonly tenantId?: string,
  ) {}
}

export class CustomerMergedEvent implements DomainEvent<{
  sourceCustomerId: string;
  targetCustomerId: string;
}> {
  readonly eventName = 'crm.customer.merged';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      sourceCustomerId: string;
      targetCustomerId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class Customer360UpdatedEvent implements DomainEvent<{
  customerId: string;
}> {
  readonly eventName = 'crm.customer360.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { customerId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ConsentUpdatedEvent implements DomainEvent<{
  customerId: string;
  consentType: string;
  isGranted: boolean;
}> {
  readonly eventName = 'crm.consent.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      customerId: string;
      consentType: string;
      isGranted: boolean;
    },
    public readonly tenantId?: string,
  ) {}
}

export class InteractionRecordedEvent implements DomainEvent<{
  interactionId: string;
  channel: string;
}> {
  readonly eventName = 'crm.interaction.recorded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { interactionId: string; channel: string },
    public readonly tenantId?: string,
  ) {}
}
