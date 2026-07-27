import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductVersionDto } from './create-version.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductVersionCreatedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductVersioningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createVersionSnapshot(
    productId: string,
    dto: CreateProductVersionDto,
    actorId?: string,
  ) {
    const product = await this.prisma.products.findFirst({
      where: { id: productId, deletedAt: null },
      include: {
        translations: true,
        prices: true,
        categoryMappings: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const latestVersion = await this.prisma.product_versions.findFirst({
      where: { productId },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    const version = await this.prisma.product_versions.create({
      data: {
        productId,
        versionNumber: nextVersionNumber,
        snapshot: JSON.parse(JSON.stringify(product)),
        status: 'DRAFT',
        createdBy: actorId,
      },
    });

    await this.eventBus.publish(
      new ProductVersionCreatedEvent(productId, {
        productId,
        versionNumber: nextVersionNumber,
        status: 'DRAFT',
      }),
    );

    return version;
  }

  async getVersions(productId: string) {
    return this.prisma.product_versions.findMany({
      where: { productId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async rollbackToVersion(
    productId: string,
    versionId: string,
    actorId?: string,
  ) {
    const version = await this.prisma.product_versions.findFirst({
      where: { id: versionId, productId },
    });

    if (!version) {
      throw new NotFoundException(`Product version ${versionId} not found`);
    }

    const snapshot = version.snapshot as any;

    const updated = await this.prisma.products.update({
      where: { id: productId },
      data: {
        name: snapshot.name,
        description: snapshot.description,
        shortDescription: snapshot.shortDescription,
        brand: snapshot.brand,
        seoTitle: snapshot.seoTitle,
        metaDescription: snapshot.metaDescription,
        updatedBy: actorId,
      },
    });

    return {
      success: true,
      message: `Rolled back product to version ${version.versionNumber}`,
      updated,
    };
  }
}
