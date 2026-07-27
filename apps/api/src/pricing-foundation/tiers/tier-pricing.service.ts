import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SetTierPriceDto } from './set-tier-price.dto';

@Injectable()
export class TierPricingService {
  constructor(private readonly prisma: PrismaService) {}

  async setTierPrice(dto: SetTierPriceDto) {
    return this.prisma.tier_prices.create({
      data: {
        productId: dto.productId,
        minQuantity: dto.minQuantity,
        maxQuantity: dto.maxQuantity,
        price: dto.price,
      },
    });
  }

  async getTierPrices(productId: string) {
    return this.prisma.tier_prices.findMany({
      where: { productId },
      orderBy: { minQuantity: 'asc' },
    });
  }
}
