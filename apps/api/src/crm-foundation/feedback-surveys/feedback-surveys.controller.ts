import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackSurveysService } from './feedback-surveys.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('CRM Foundation — Feedback & Surveys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm-feedback')
export class FeedbackSurveysController {
  constructor(private readonly service: FeedbackSurveysService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit feedback survey mapping NPS classification categories',
  })
  async submitFeedback(
    @Body()
    body: {
      tenantId?: string;
      customerId: string;
      score: number;
      comments?: string;
    },
  ) {
    return this.service.submitFeedback(
      body.tenantId || 'GLOBAL',
      body.customerId,
      body.score,
      body.comments,
    );
  }

  @Post('survey')
  @ApiOperation({ summary: 'Submit survey answers' })
  async submitSurvey(
    @Body() body: { tenantId?: string; surveyId: string; score: number },
  ) {
    return this.service.submitSurvey(
      body.tenantId || 'GLOBAL',
      body.surveyId,
      body.score,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List customer feedback entries' })
  async getFeedback(@Query('tenantId') tenantId?: string) {
    return this.service.listFeedback(tenantId);
  }
}
