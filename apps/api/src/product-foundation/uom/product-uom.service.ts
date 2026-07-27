import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductUomDto } from './create-uom.dto';

@Injectable()
export class ProductUomService {
  constructor(private readonly prisma: PrismaService) {}

  async createUom(tenantId: string | undefined, dto: CreateProductUomDto) {
    return this.prisma.product_uom.upsert({
      where: { code: dto.code },
      create: {
        tenantId,
        name: dto.name,
        code: dto.code,
        symbol: dto.symbol,
        baseUnitId: dto.baseUnitId,
        conversionFactor: dto.conversionFactor ?? 1,
      },
      update: {
        name: dto.name,
        symbol: dto.symbol,
        conversionFactor: dto.conversionFactor ?? 1,
      },
    });
  }

  async listUoms(tenantId?: string) {
    return this.prisma.product_uom.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }
}
