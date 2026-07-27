import { Global, Module } from '@nestjs/common';
import { NotificationPlatformService } from './notification-platform.service';

@Global()
@Module({
  providers: [NotificationPlatformService],
  exports: [NotificationPlatformService],
})
export class NotificationPlatformModule {}
