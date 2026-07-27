import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePricingWorkflowStatusDto } from './update-workflow-status.dto';
import { PricingWorkflowStatus } from '@prisma/client';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  PricingPublishedEvent,
  PricingRejectedEvent,
} from '../../event-bus/events/pricing.events';

@Injectable()
export class PricingWorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async updateWorkflowStatus(
    priceBookId: string,
    dto: UpdatePricingWorkflowStatusDto,
  ) {
    const book = await this.prisma.price_books.findFirst({
      where: { id: priceBookId, deletedAt: null },
    });

    if (!book) {
      throw new NotFoundException(
        `Price book with ID ${priceBookId} not found`,
      );
    }

    const updated = await this.prisma.price_books.update({
      where: { id: priceBookId },
      data: {
        workflowStatus: dto.status,
      },
    });

    if (dto.status === PricingWorkflowStatus.PUBLISHED) {
      await this.eventBus.publish(
        new PricingPublishedEvent(priceBookId, {
          priceBookId,
          versionNumber: book.versionNumber,
        }),
      );
    } else if (dto.status === PricingWorkflowStatus.REJECTED) {
      await this.eventBus.publish(
        new PricingRejectedEvent(priceBookId, {
          priceBookId,
          reason: dto.reason || 'Workflow Rejected',
        }),
      );
    }

    return updated;
  }
}
