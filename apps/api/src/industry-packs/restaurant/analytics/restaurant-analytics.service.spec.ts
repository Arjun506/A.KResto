import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantAnalyticsService } from './restaurant-analytics.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('RestaurantAnalyticsService', () => {
  let service: RestaurantAnalyticsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      rest_tables: {
        findMany: jest.fn(),
      },
      rest_reservations: {
        findMany: jest.fn(),
      },
      rest_kitchen_tickets: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantAnalyticsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RestaurantAnalyticsService>(
      RestaurantAnalyticsService,
    );
  });

  it('should compile and calculate turnover metrics safely', async () => {
    prisma.rest_tables.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);
    prisma.rest_reservations.findMany.mockResolvedValue([{ id: '1' }]);
    prisma.rest_kitchen_tickets.findMany.mockResolvedValue([]);

    const result = await service.getRestaurantMetrics('t_1');

    expect(prisma.rest_tables.findMany).toHaveBeenCalled();
    expect(result.totalTables).toEqual(2);
    expect(result.tableTurnoverRate).toEqual(0.5);
  });
});
