import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { CustomerSearchExecutedEvent } from '../event-bus/events/cust.events';

@Injectable()
export class CustSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async searchCatalog(tenantId: string, query: string) {
    const products = await this.prisma.products.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    await this.eventBus.publish(
      new CustomerSearchExecutedEvent(
        tenantId,
        { query, resultsCount: products.length },
        tenantId,
      ),
    );

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: (p.metadata as any)?.price || 0.0,
      isMenuItem: (p.metadata as any)?.isMenuItem || false,
    }));
  }
}
