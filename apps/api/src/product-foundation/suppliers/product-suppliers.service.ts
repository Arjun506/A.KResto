import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LinkProductSupplierDto } from './link-supplier.dto';

@Injectable()
export class ProductSuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async linkSupplier(productId: string, dto: LinkProductSupplierDto) {
    if (dto.isPrimary) {
      await this.prisma.product_suppliers.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.product_suppliers.create({
      data: {
        productId,
        supplierBusinessId: dto.supplierBusinessId,
        supplierPartNumber: dto.supplierPartNumber,
        costPrice: dto.costPrice,
        moq: dto.moq ?? 1,
        leadTimeDays: dto.leadTimeDays,
        isPrimary: dto.isPrimary ?? false,
      },
      include: {
        supplierBusiness: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async getSuppliers(productId: string) {
    return this.prisma.product_suppliers.findMany({
      where: { productId },
      include: {
        supplierBusiness: { select: { id: true, name: true, code: true } },
      },
    });
  }
}
