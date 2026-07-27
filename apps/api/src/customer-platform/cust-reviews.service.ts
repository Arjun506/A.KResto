import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  ReviewSubmittedEvent,
  ConsentUpdatedEvent,
  TimelineEventLoggedEvent,
} from '../event-bus/events/cust.events';

@Injectable()
export class CustReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async submitReview(
    tenantId: string,
    customerId: string,
    targetType: string,
    targetId: string,
    rating: number,
    comment?: string,
  ) {
    const review = await this.prisma.cust_reviews.create({
      data: {
        tenantId,
        customerId,
        targetType,
        targetId,
        rating,
        comment,
      },
    });

    await this.eventBus.publish(
      new ReviewSubmittedEvent(
        review.id,
        { reviewId: review.id, rating },
        tenantId,
      ),
    );

    return review;
  }

  async updatePrivacyConsent(
    customerId: string,
    marketingConsent: boolean,
    gdprOptOut: boolean,
  ) {
    const consent = await this.prisma.cust_consent_settings.upsert({
      where: { customerId },
      update: { marketingConsent, gdprOptOut },
      create: { customerId, marketingConsent, gdprOptOut },
    });

    await this.eventBus.publish(
      new ConsentUpdatedEvent(customerId, { customerId, gdprOptOut }),
    );

    return consent;
  }

  async logTimelineEvent(
    customerId: string,
    eventType: string,
    description: string,
  ) {
    // Consume CRM timeline logger structure
    await this.eventBus.publish(
      new TimelineEventLoggedEvent(customerId, { customerId, eventType }),
    );

    return {
      customerId,
      eventType,
      description,
      loggedAt: new Date(),
    };
  }
}
