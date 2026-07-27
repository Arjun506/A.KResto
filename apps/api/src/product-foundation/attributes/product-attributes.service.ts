import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProductAttributeDto,
  SetAttributeValueDto,
} from './create-attribute.dto';

@Injectable()
export class ProductAttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttribute(
    tenantId: string | undefined,
    dto: CreateProductAttributeDto,
  ) {
    return this.prisma.product_attributes.upsert({
      where: { code: dto.code },
      create: {
        tenantId,
        name: dto.name,
        code: dto.code,
        dataType: dto.dataType || 'STRING',
        options: dto.options,
      },
      update: {
        name: dto.name,
        options: dto.options,
      },
    });
  }

  async listAttributes(tenantId?: string) {
    return this.prisma.product_attributes.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }

  async setAttributeValue(productId: string, dto: SetAttributeValueDto) {
    return this.prisma.product_attribute_values.create({
      data: {
        productId,
        attributeId: dto.attributeId,
        valueString: dto.valueString,
      },
    });
  }
}
