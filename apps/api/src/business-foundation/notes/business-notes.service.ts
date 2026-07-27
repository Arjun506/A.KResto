import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './create-note.dto';

@Injectable()
export class BusinessNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async addNote(businessId: string, authorId: string, dto: CreateNoteDto) {
    return this.prisma.business_notes.create({
      data: {
        businessId,
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

  async getNotes(businessId: string, currentUserId?: string) {
    return this.prisma.business_notes.findMany({
      where: {
        businessId,
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
    return this.prisma.business_notes.update({
      where: { id: noteId },
      data: { deletedAt: new Date() },
    });
  }
}
