import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TagOrderDto } from './tag-order.dto';

@Injectable()
export class OrderTagsService {
  constructor(private readonly prisma: PrismaService) {}

  async tagOrder(orderId: string, dto: TagOrderDto) {
    return this.prisma.order_tags.create({
      data: {
        orderId,
        tag: dto.tag,
      },
    });
  }

  async getTags(orderId: string) {
    return this.prisma.order_tags.findMany({
      where: { orderId },
    });
  }
}
