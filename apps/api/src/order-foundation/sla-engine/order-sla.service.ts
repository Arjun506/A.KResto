import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrderSlaService {
  constructor(private readonly prisma: PrismaService) {}

  async setOrderSla(
    orderId: string,
    dueDate?: Date,
    targetCompletionAt?: Date,
    priority: string = 'NORMAL',
  ) {
    return this.prisma.order_slas.create({
      data: {
        orderId,
        dueDate,
        targetCompletionAt,
        priority,
      },
    });
  }

  async getOrderSla(orderId: string) {
    return this.prisma.order_slas.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
