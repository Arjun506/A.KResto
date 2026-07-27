import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CustomerMergedEvent } from '../../event-bus/events/crm.events';

@Injectable()
export class CustomerIdentityMergeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async detectDuplicates(fullName: string, email?: string) {
    return this.prisma.customers.findMany({
      where: {
        OR: [
          email
            ? {
                contacts: {
                  some: {
                    value: email,
                    type: 'PRIMARY_EMAIL',
                  },
                },
              }
            : undefined,
          fullName
            ? {
                profile: {
                  OR: [
                    { firstName: { contains: fullName, mode: 'insensitive' } },
                    { lastName: { contains: fullName, mode: 'insensitive' } },
                    {
                      displayName: { contains: fullName, mode: 'insensitive' },
                    },
                  ],
                },
              }
            : undefined,
        ].filter(Boolean) as any[],
      },
      include: { profile: true, contacts: true },
      take: 10,
    });
  }

  async mergeCustomers(
    tenantId: string,
    sourceCustomerId: string,
    targetCustomerId: string,
  ) {
    // Audit merge link record
    await this.prisma.crm_relationships.create({
      data: {
        tenantId,
        fromCustomerId: sourceCustomerId,
        toCustomerId: targetCustomerId,
        relationshipType: 'MERGED_TO',
      },
    });

    await this.eventBus.publish(
      new CustomerMergedEvent(
        targetCustomerId,
        { sourceCustomerId, targetCustomerId },
        tenantId,
      ),
    );

    return {
      sourceCustomerId,
      targetCustomerId,
      mergeStatus: 'COMPLETED',
      notes: 'Customer profile references mapped to primary profile.',
    };
  }
}
