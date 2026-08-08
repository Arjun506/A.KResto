import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  discountType?: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  discountValue!: number;

  @IsOptional()
  @IsNumber()
  minPurchaseAmount?: number;

  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @IsOptional()
  @IsString()
  targetTier?: string;

  @IsOptional()
  @IsString()
  targetSegment?: string;

  @IsOptional()
  @IsString()
  validFrom?: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;
}

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOffer(tenantId: string, dto: CreateOfferDto) {
    if (!dto.code || !dto.title || dto.discountValue === undefined) {
      throw new BadRequestException('Offer code, title, and discountValue are required');
    }

    const code = dto.code.trim().toUpperCase();

    const existing = await this.prisma.customer_offers.findUnique({
      where: { tenantId_code: { tenantId, code } },
    });
    if (existing) {
      throw new ConflictException(`Offer with code ${code} already exists for this tenant`);
    }

    return this.prisma.customer_offers.create({
      data: {
        tenantId,
        code,
        title: dto.title,
        description: dto.description,
        discountType: dto.discountType || 'PERCENTAGE',
        discountValue: Number(dto.discountValue),
        minPurchaseAmount: Number(dto.minPurchaseAmount || 0),
        maxDiscountAmount: dto.maxDiscountAmount ? Number(dto.maxDiscountAmount) : null,
        targetTier: dto.targetTier || null,
        targetSegment: dto.targetSegment || null,
        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        usageLimit: dto.usageLimit ? Number(dto.usageLimit) : null,
        isActive: true,
      },
    });
  }

  async getOffers(tenantId: string) {
    return this.prisma.customer_offers.findMany({
      where: { tenantId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCustomerApplicableOffers(tenantId: string, customerId: string) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      include: { crmLoyalty: true },
    });

    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const tier = customer.crmLoyalty?.tier || 'NEW';

    const allOffers = await this.prisma.customer_offers.findMany({
      where: { tenantId, isActive: true },
    });

    const now = new Date();

    return allOffers.filter((offer) => {
      if (offer.validUntil && offer.validUntil < now) return false;
      if (offer.validFrom && offer.validFrom > now) return false;
      if (offer.usageLimit && offer.usedCount >= offer.usageLimit) return false;
      if (offer.targetTier && offer.targetTier !== tier && offer.targetTier !== 'ALL') return false;
      return true;
    });
  }
}
