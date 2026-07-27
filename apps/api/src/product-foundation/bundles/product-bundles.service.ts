import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductBundleDto } from './create-bundle.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { ProductBundleCreatedEvent } from '../../event-bus/events/product.events';

@Injectable()
export class ProductBundlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async addBundleComponent(
    parentProductId: string,
    dto: CreateProductBundleDto,
  ) {
    const bundle = await this.prisma.product_bundles.create({
      data: {
        parentProductId,
        componentProductId: dto.componentProductId,
        quantity: dto.quantity ?? 1,
        discountPercentage: dto.discountPercentage ?? 0,
        isOptional: dto.isOptional ?? false,
      },
      include: {
        componentProduct: { select: { id: true, sku: true, name: true } },
      },
    });

    await this.eventBus.publish(
      new ProductBundleCreatedEvent(parentProductId, {
        parentProductId,
        componentProductId: dto.componentProductId,
      }),
    );

    return bundle;
  }

  async getBundleComponents(parentProductId: string) {
    return this.prisma.product_bundles.findMany({
      where: { parentProductId },
      include: {
        componentProduct: { select: { id: true, sku: true, name: true } },
      },
    });
  }

  async removeBundleComponent(bundleId: string) {
    return this.prisma.product_bundles.delete({
      where: { id: bundleId },
    });
  }
}
