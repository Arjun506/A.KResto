import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

/**
 * Queue module configuration
 * Registers all job queues with BullMQ
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      }),
    }),
    // Register all queues
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'pdf-export' },
      { name: 'analytics' },
      { name: 'image-processing' },
      { name: 'notifications' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
