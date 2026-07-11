import { PrismaService } from '../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { EmailProcessor } from './processors/email.processor';
import { SmsProcessor } from './processors/sms.processor';
import { DeliveryProcessor } from './processors/delivery.processor';

@Module({
  imports: [
    
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'notifications' },
    ),
  ],
  controllers: [NotificationsController],
  providers: [
    PrismaService,
    NotificationsService,
    NotificationsGateway,
    EmailProcessor,
    SmsProcessor,
    DeliveryProcessor,
  ],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
