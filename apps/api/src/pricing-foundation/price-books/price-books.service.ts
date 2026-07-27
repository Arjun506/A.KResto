import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceBooksRepository } from './price-books.repository';
import { CreatePriceBookDto } from './dto/create-price-book.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import { AuditService } from '../../audit/audit.service';
import { PriceBookCreatedEvent } from '../../event-bus/events/pricing.events';

@Injectable()
export class PriceBooksService {
  constructor(
    private readonly repo: PriceBooksRepository,
    private readonly eventBus: EventBusService,
    private readonly auditService: AuditService,
  ) {}

  async createPriceBook(dto: CreatePriceBookDto, actorId?: string) {
    const book = await this.repo.create(dto);

    await this.repo.recordTimeline(
      book.id,
      'PRICE_BOOK_CREATED',
      `Price Book ${book.name} (${book.code}) created`,
      actorId,
    );

    await this.eventBus.publish(
      new PriceBookCreatedEvent(
        book.id,
        { priceBookId: book.id, code: book.code, name: book.name },
        book.tenantId || undefined,
      ),
    );

    await this.auditService.logEvent({
      tenantId: book.tenantId || 'GLOBAL',
      userId: actorId,
      entity: 'PRICE_BOOK',
      entityId: book.id,
      action: 'CREATE',
      changes: [`Created Price Book ${book.name} (${book.code})`],
    });

    return book;
  }

  async getPriceBookById(id: string) {
    const book = await this.repo.findById(id);
    if (!book) {
      throw new NotFoundException(`Price Book with ID ${id} not found`);
    }
    return book;
  }

  async listPriceBooks(
    tenantId?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const { items, total } = await this.repo.list(tenantId, page, limit);
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async softDeletePriceBook(id: string, actorId?: string) {
    const book = await this.getPriceBookById(id);
    await this.repo.softDelete(id);

    await this.repo.recordTimeline(
      id,
      'PRICE_BOOK_DELETED',
      `Price Book ${book.code} soft deleted`,
      actorId,
    );

    return { success: true, message: `Price Book ${id} soft deleted` };
  }
}
