import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductTagDto, AssignProductTagDto } from './create-tag.dto';

@Injectable()
export class ProductTagsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTag(tenantId: string | undefined, dto: CreateProductTagDto) {
    return this.prisma.product_tags.upsert({
      where: { name: dto.name },
      create: { tenantId, name: dto.name, color: dto.color },
      update: { color: dto.color },
    });
  }

  async listTags(tenantId?: string) {
    return this.prisma.product_tags.findMany({
      where: tenantId ? { tenantId } : {},
    });
  }

  async assignTag(productId: string, dto: AssignProductTagDto) {
    return this.prisma.product_tag_mappings.upsert({
      where: {
        productId_tagId: { productId, tagId: dto.tagId },
      },
      create: { productId, tagId: dto.tagId },
      update: {},
    });
  }

  async unassignTag(productId: string, tagId: string) {
    return this.prisma.product_tag_mappings.deleteMany({
      where: { productId, tagId },
    });
  }
}
