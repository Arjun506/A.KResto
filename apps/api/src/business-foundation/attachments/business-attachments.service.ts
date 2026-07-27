import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttachmentDto } from './create-attachment.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { BusinessAttachmentUploadedEvent } from '../../event-bus/events/business.events';

@Injectable()
export class BusinessAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addAttachment(businessId: string, dto: CreateAttachmentDto) {
    const attachment = await this.prisma.business_attachments.create({
      data: {
        businessId,
        fileKey: dto.fileKey,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        category: dto.category,
        url: dto.url,
      },
    });

    await this.eventBus.publish(
      new BusinessAttachmentUploadedEvent(businessId, {
        businessId,
        attachmentId: attachment.id,
        category: dto.category,
      }),
    );

    return attachment;
  }

  async getAttachments(businessId: string) {
    return this.prisma.business_attachments.findMany({
      where: { businessId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDeleteAttachment(attachmentId: string) {
    return this.prisma.business_attachments.update({
      where: { id: attachmentId },
      data: { deletedAt: new Date() },
    });
  }
}
