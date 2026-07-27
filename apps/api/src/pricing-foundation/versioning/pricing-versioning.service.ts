import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PricingVersionCreatedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class PricingVersioningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createVersionSnapshot(priceBookId: string, actorId?: string) {
    const priceBook = await this.prisma.price_books.findFirst({
      where: { id: priceBookId, deletedAt: null },
      include: { priceLists: true },
    });

    if (!priceBook) {
      throw new NotFoundException(
        `Price book with ID ${priceBookId} not found`,
      );
    }

    const latestVersion = await this.prisma.price_book_versions.findFirst({
      where: { priceBookId },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    const version = await this.prisma.price_book_versions.create({
      data: {
        priceBookId,
        versionNumber: nextVersionNumber,
        snapshot: JSON.parse(JSON.stringify(priceBook)),
        status: 'DRAFT',
        createdBy: actorId,
      },
    });

    await this.eventBus.publish(
      new PricingVersionCreatedEvent(priceBookId, {
        priceBookId,
        versionNumber: nextVersionNumber,
      }),
    );

    return version;
  }

  async getVersions(priceBookId: string) {
    return this.prisma.price_book_versions.findMany({
      where: { priceBookId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async rollbackToVersion(priceBookId: string, versionId: string) {
    const version = await this.prisma.price_book_versions.findFirst({
      where: { id: versionId, priceBookId },
    });

    if (!version) {
      throw new NotFoundException(`Price book version ${versionId} not found`);
    }

    const snapshot = version.snapshot as any;

    const updated = await this.prisma.price_books.update({
      where: { id: priceBookId },
      data: {
        name: snapshot.name,
        description: snapshot.description,
        isDefault: snapshot.isDefault,
        versionNumber: version.versionNumber,
      },
    });

    return {
      success: true,
      message: `Rolled back price book to version ${version.versionNumber}`,
      updated,
    };
  }
}
