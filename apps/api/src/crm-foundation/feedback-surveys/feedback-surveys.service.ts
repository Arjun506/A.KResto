import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  FeedbackReceivedEvent,
  SurveyCompletedEvent,
} from '../../event-bus/events/crm.events';

@Injectable()
export class FeedbackSurveysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async submitFeedback(
    tenantId: string,
    customerId: string,
    score: number,
    comments?: string,
  ) {
    let npsCategory = 'PASSIVE';
    if (score >= 9) {
      npsCategory = 'PROMOTER';
    } else if (score <= 6) {
      npsCategory = 'DETRACTOR';
    }

    const feedback = await this.prisma.crm_feedbacks.create({
      data: {
        tenantId,
        customerId,
        score,
        comments,
        npsCategory,
      },
    });

    await this.eventBus.publish(
      new FeedbackReceivedEvent(
        feedback.id,
        { feedbackId: feedback.id, score },
        tenantId,
      ),
    );

    return feedback;
  }

  async submitSurvey(tenantId: string, surveyId: string, score: number) {
    await this.eventBus.publish(
      new SurveyCompletedEvent(surveyId, { surveyId, score }, tenantId),
    );
    return { surveyId, score, status: 'SUBMITTED' };
  }

  async listFeedback(tenantId?: string) {
    const where = tenantId ? { tenantId } : {};
    return this.prisma.crm_feedbacks.findMany({ where });
  }
}
