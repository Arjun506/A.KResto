import { Injectable, Logger } from '@nestjs/common';
import {
  INotificationChannel,
  NotificationChannelType,
  NotificationPayload,
} from './notification-channel.interface';

@Injectable()
export class NotificationPlatformService {
  private readonly logger = new Logger(NotificationPlatformService.name);
  private readonly channels = new Map<
    NotificationChannelType,
    INotificationChannel
  >();

  registerChannel(channel: INotificationChannel) {
    this.channels.set(channel.type, channel);
    this.logger.log(
      `[NotificationPlatform] Registered channel driver: ${channel.type}`,
    );
  }

  async send(
    channelType: NotificationChannelType,
    payload: NotificationPayload,
  ): Promise<boolean> {
    const channel = this.channels.get(channelType);
    if (!channel) {
      this.logger.warn(
        `[NotificationPlatform] Channel driver for ${channelType} not registered. Fallback logging output.`,
      );
      this.logger.log(
        `[NotificationPayload] Recipient: ${payload.recipient} | Body: ${payload.body}`,
      );
      return true;
    }
    return channel.send(payload);
  }

  async dispatchMultiChannel(
    channels: NotificationChannelType[],
    payload: NotificationPayload,
  ): Promise<Record<NotificationChannelType, boolean>> {
    const results: Partial<Record<NotificationChannelType, boolean>> = {};
    for (const ch of channels) {
      results[ch] = await this.send(ch, payload);
    }
    return results as Record<NotificationChannelType, boolean>;
  }
}
