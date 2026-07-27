import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';

export interface SearchResult<T = any> {
  items: T[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable()
export class SearchService {
  buildPaginationMeta(totalItems: number, query: SearchQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  formatResult<T>(
    items: T[],
    totalItems: number,
    query: SearchQueryDto,
  ): SearchResult<T> {
    const meta = this.buildPaginationMeta(totalItems, query);
    return {
      items,
      ...meta,
    };
  }
}
