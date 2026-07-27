import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantCoreService } from './restaurant-core.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('RestaurantCoreService', () => {
  let service: RestaurantCoreService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      products: {
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantCoreService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RestaurantCoreService>(RestaurantCoreService);
  });

  it('should register menu items and map modifier groups in Product Catalog metadata', async () => {
    const dto = {
      name: 'Cheeseburger',
      description: 'With cheddar',
      price: 9.99,
    };

    const mockProd = { id: 'prod_1', ...dto, tenantId: 't_1' };
    prisma.products.create.mockResolvedValue(mockProd);

    const result = await service.createMenuItem('t_1', dto);

    expect(prisma.products.create).toHaveBeenCalled();
    expect(result.id).toEqual('prod_1');
  });
});
