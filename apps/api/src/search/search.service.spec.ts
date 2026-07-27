import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate pagination metadata correctly', () => {
    const meta = service.buildPaginationMeta(100, { page: 2, limit: 10 });
    expect(meta.page).toBe(2);
    expect(meta.limit).toBe(10);
    expect(meta.totalItems).toBe(100);
    expect(meta.totalPages).toBe(10);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPreviousPage).toBe(true);
  });

  it('should format paginated search results', () => {
    const items = [{ id: '1', name: 'Item 1' }];
    const res = service.formatResult(items, 1, { page: 1, limit: 20 });
    expect(res.items).toEqual(items);
    expect(res.totalItems).toBe(1);
    expect(res.hasNextPage).toBe(false);
  });
});
