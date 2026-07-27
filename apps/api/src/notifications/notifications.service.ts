import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import type { JwtUser } from '../common/types/jwt-user.interface';

export interface SendNotificationInput {
  tenantId?: string;
  userIds?: string[];
  role?: string;
  trigger?: string;
  variables?: Record<string, any>;
  title?: string;
  body?: string;
  type?: string;
  priority?: string;
  category?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('sms') private readonly smsQueue: Queue,
    @InjectQueue('notifications') private readonly deliveryQueue: Queue,
  ) {}

  /**
   * Universal Notification Dispatcher
   */
  async sendNotification(input: SendNotificationInput): Promise<any> {
    this.logger.log(
      `Dispatching notification. Trigger: ${input.trigger ?? 'None'}`,
    );
    let title = input.title ?? 'Alert';
    let body = input.body ?? '';
    const type = input.type ?? 'INFO';
    const priority = input.priority ?? 'LOW';
    let category = input.category ?? 'general';
    let configuredChannels = ['IN_APP'];

    // 1. Resolve template if trigger is provided
    if (input.trigger) {
      const template = await this.prisma.notification_templates.findUnique({
        where: { trigger: input.trigger },
      });
      if (template && template.active) {
        const vars = input.variables ?? {};
        title = this.interpolate(template.titleTemplate, vars);
        body = this.interpolate(template.bodyTemplate, vars);
        configuredChannels = template.channels;
        category = template.trigger.toLowerCase().split('_')[0]; // e.g. order, payment, inventory
      }
    }

    // 2. Resolve target recipient user IDs
    let targetUserIds: string[] = [];
    if (input.userIds && input.userIds.length > 0) {
      targetUserIds = input.userIds;
    } else if (input.role) {
      const users = await this.prisma.users.findMany({
        where: {
          role: input.role as any,
          tenantId: input.tenantId || undefined,
          isActive: true,
        },
        select: { id: true },
      });
      targetUserIds = users.map((u) => u.id);
    } else if (input.tenantId) {
      // Default: notify all staff and managers of this tenant
      const users = await this.prisma.users.findMany({
        where: {
          tenantId: input.tenantId,
          role: {
            in: ['OWNER', 'MANAGER', 'CASHIER', 'OPERATOR'],
          },
          isActive: true,
        },
        select: { id: true },
      });
      targetUserIds = users.map((u) => u.id);
    }

    if (targetUserIds.length === 0) {
      this.logger.warn('No target recipients resolved for notification.');
      return { success: false, message: 'No recipients found' };
    }

    // 3. Create Notification entity
    const notification = await this.prisma.notifications.create({
      data: {
        tenantId: input.tenantId || null,
        title,
        body,
        type,
        priority,
        category,
        metadata: (input.metadata as any) || undefined,
      },
    });

    // 4. Process each recipient with preference checks
    for (const userId of targetUserIds) {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      if (!user) continue;

      // Create Recipient record
      const recipient = await this.prisma.notification_recipients.create({
        data: {
          notificationId: notification.id,
          userId,
          read: false,
        },
      });

      // Get user preference for this category
      const userPrefs = await this.prisma.notification_preferences.findUnique({
        where: { userId_category: { userId, category } },
      });
      const allowedChannels = userPrefs
        ? userPrefs.channels
        : configuredChannels;

      // Deliver via each allowed channel
      for (const channel of allowedChannels) {
        if (channel === 'IN_APP') {
          // Log history
          await this.prisma.notification_history.create({
            data: {
              notificationId: notification.id,
              recipientId: recipient.id,
              channel: 'IN_APP',
              status: 'SUCCESS',
              sentAt: new Date(),
            },
          });
          // Dispatch WebSocket event in real-time
          this.gateway.emitNotification(userId, {
            id: recipient.id,
            notificationId: notification.id,
            title,
            body,
            type,
            priority,
            category,
            createdAt: notification.createdAt,
            read: false,
          });
        } else {
          // Asynchronous channels (EMAIL, SMS, WHATSAPP, PUSH, WEBHOOK)
          const history = await this.prisma.notification_history.create({
            data: {
              notificationId: notification.id,
              recipientId: recipient.id,
              channel,
              status: 'PENDING',
            },
          });
          const jobData = {
            notificationId: notification.id,
            recipientId: recipient.id,
            historyId: history.id,
            title,
            body,
            channel,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: (user as any).phone || '',
            },
          };
          // Dispatch to respective queue
          if (channel === 'EMAIL') {
            await this.emailQueue.add('sendEmail', jobData);
          } else if (channel === 'SMS') {
            await this.smsQueue.add('sendSms', jobData);
          } else {
            await this.deliveryQueue.add('deliverPushOrWebhook', jobData);
          }
        }
      }
    }
    return {
      success: true,
      notificationId: notification.id,
      recipientCount: targetUserIds.length,
    };
  }

  /**
   * User notification feed operations
   */
  async getNotifications(
    user: JwtUser,
    filter?: {
      read?: boolean;
      category?: string;
      limit?: number;
      page?: number;
    },
  ) {
    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {
      userId: user.id,
      archived: false,
    };

    if (filter?.read !== undefined) {
      where.read = filter.read;
    }
    if (filter?.category) {
      where.notification = {
        category: filter.category,
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.notification_recipients.findMany({
        where,
        include: {
          notification: true,
        },
        orderBy: {
          notification: {
            createdAt: 'desc',
          },
        },
        skip,
        take: limit,
      }),
      this.prisma.notification_recipients.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        notificationId: item.notificationId,
        title: item.notification.title,
        body: item.notification.body,
        type: item.notification.type,
        priority: item.notification.priority,
        category: item.notification.category,
        createdAt: item.notification.createdAt,
        read: item.read,
      })),
      total,
      page,
      limit,
    };
  }

  async markAsRead(user: JwtUser, id: string) {
    const recipient = await this.prisma.notification_recipients.findFirst({
      where: { id, userId: user.id },
    });
    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification_recipients.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async markAllRead(user: JwtUser) {
    return this.prisma.notification_recipients.updateMany({
      where: {
        userId: user.id,
        read: false,
        archived: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  async archiveNotification(user: JwtUser, id: string) {
    const recipient = await this.prisma.notification_recipients.findFirst({
      where: { id, userId: user.id },
    });
    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification_recipients.update({
      where: { id },
      data: {
        archived: true,
        archivedAt: new Date(),
      },
    });
  }

  async deleteNotification(user: JwtUser, id: string) {
    const recipient = await this.prisma.notification_recipients.findFirst({
      where: { id, userId: user.id },
    });
    if (!recipient) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification_recipients.delete({
      where: { id },
    });
  }

  /**
   * User alert preferences
   */
  async getPreferences(user: JwtUser) {
    return this.prisma.notification_preferences.findMany({
      where: { userId: user.id },
    });
  }

  async updatePreferences(user: JwtUser, dto: UpdatePreferencesDto) {
    return this.prisma.notification_preferences.upsert({
      where: {
        userId_category: {
          userId: user.id,
          category: dto.category,
        },
      },
      update: {
        channels: dto.channels,
      },
      create: {
        userId: user.id,
        category: dto.category,
        channels: dto.channels,
      },
    });
  }

  /**
   * Admin template management
   */
  async getTemplates() {
    return this.prisma.notification_templates.findMany();
  }

  async upsertTemplate(dto: CreateTemplateDto) {
    return this.prisma.notification_templates.upsert({
      where: { trigger: dto.trigger },
      update: {
        titleTemplate: dto.titleTemplate,
        bodyTemplate: dto.bodyTemplate,
        channels: dto.channels,
        active: dto.active ?? true,
      },
      create: {
        trigger: dto.trigger,
        titleTemplate: dto.titleTemplate,
        bodyTemplate: dto.bodyTemplate,
        channels: dto.channels,
        active: dto.active ?? true,
      },
    });
  }

  /**
   * Helper interpolation function (regex replacement)
   */
  private interpolate(
    template: string,
    variables: Record<string, any>,
  ): string {
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      return variables[key] !== undefined
        ? String(variables[key])
        : `{{${key}}}`;
    });
  }
}
