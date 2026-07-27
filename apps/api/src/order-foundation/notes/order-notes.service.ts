import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddOrderNoteDto } from './add-order-note.dto';

@Injectable()
export class OrderNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async addNote(orderId: string, dto: AddOrderNoteDto, authorId?: string) {
    return this.prisma.order_notes.create({
      data: {
        orderId,
        authorId,
        isCustomerFacing: dto.isCustomerFacing ?? false,
        noteText: dto.noteText,
      },
    });
  }

  async getNotes(orderId: string) {
    return this.prisma.order_notes.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
