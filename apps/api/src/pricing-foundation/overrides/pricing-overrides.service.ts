import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetCustomerPriceDto, SetBusinessPriceDto } from './set-override.dto';

@Injectable()
export class PricingOverridesService {
  constructor(private readonly prisma: PrismaService) {}

  async setCustomerPrice(dto: SetCustomerPriceDto) {
    return this.prisma.customer_prices.create({
      data: {
        customerId: dto.customerId,
        productId: dto.productId,
        customPrice: dto.customPrice,
        currency: dto.currency || 'USD',
      },
    });
  }

  async setBusinessPrice(dto: SetBusinessPriceDto) {
    return this.prisma.business_prices.create({
      data: {
        businessId: dto.businessId,
        productId: dto.productId,
        contractPrice: dto.contractPrice,
        currency: dto.currency || 'USD',
      },
    });
  }
}
