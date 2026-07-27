import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerAttachmentDto } from './create-attachment.dto';

@Injectable()
export class CustomerAttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async addAttachment(customerId: string, dto: CreateCustomerAttachmentDto) {
    return this.prisma.customer_attachments.create({
      data: {
        customerId,
        fileKey: dto.fileKey,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        category: dto.category,
        url: dto.url,
      },
    });
  }

  async getAttachments(customerId: string) {
    return this.prisma.customer_attachments.findMany({
      where: { customerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDeleteAttachment(attachmentId: string) {
    return this.prisma.customer_attachments.update({
      where: { id: attachmentId },
      data: { deletedAt: new Date() },
    });
  }
}
