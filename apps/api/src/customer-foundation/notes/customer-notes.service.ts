import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerNoteDto } from './create-note.dto';

@Injectable()
export class CustomerNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async addNote(
    customerId: string,
    authorId: string,
    dto: CreateCustomerNoteDto,
  ) {
    return this.prisma.customer_notes.create({
      data: {
        customerId,
        authorId,
        content: dto.content,
        isPrivate: dto.isPrivate ?? true,
        isPinned: dto.isPinned ?? false,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getNotes(customerId: string, currentUserId?: string) {
    return this.prisma.customer_notes.findMany({
      where: {
        customerId,
        deletedAt: null,
        OR: [{ isPrivate: false }, { authorId: currentUserId }],
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async softDeleteNote(noteId: string) {
    return this.prisma.customer_notes.update({
      where: { id: noteId },
      data: { deletedAt: new Date() },
    });
  }
}
