import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerLoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  async getLoyaltyRecord(customerId: string) {
    let loyalty = await this.prisma.customer_loyalty.findUnique({
      where: { customerId },
    });

    if (!loyalty) {
      loyalty = await this.prisma.customer_loyalty.create({
        data: {
          customerId,
          tier: 'BRONZE',
          status: 'ACTIVE',
          pointsBalance: 0,
        },
      });
    }

    return loyalty;
  }
}
