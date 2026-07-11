import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('sms')
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('sendSms')
  async handleSendSms(job: Job<any>) {
    const { historyId, user } = job.data;
    const phone = user.phone || '9876543210';
    this.logger.log(`Processing background SMS job ${job.id} to: ${phone}`);

    try {
      // Mock provider delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update history status
      await this.prisma.notification_history.update({
        where: { id: historyId },
        data: {
          status: 'SUCCESS',
          sentAt: new Date(),
        },
      });

      this.logger.log(`SMS successfully dispatched via provider to ${phone}`);
    } catch (err: any) {
      this.logger.error(`Failed to deliver SMS to ${phone}`, err);
      await this.prisma.notification_history.update({
        where: { id: historyId },
        data: {
          status: 'FAILED',
          errorMessage: err.message || 'Unknown provider error',
        },
      });
    }
  }
}
