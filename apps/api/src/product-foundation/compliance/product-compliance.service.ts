import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplianceDto } from './create-compliance.dto';

@Injectable()
export class ProductComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async addComplianceRecord(productId: string, dto: CreateComplianceDto) {
    return this.prisma.product_compliance.create({
      data: {
        productId,
        certificationName: dto.certificationName,
        regulatoryCode: dto.regulatoryCode,
        countryRestriction: dto.countryRestriction,
        documentUrl: dto.documentUrl,
      },
    });
  }

  async getComplianceRecords(productId: string) {
    return this.prisma.product_compliance.findMany({
      where: { productId },
    });
  }
}
