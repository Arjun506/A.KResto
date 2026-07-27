import { Test, TestingModule } from '@nestjs/testing';
import { ProductPublishingService } from './product-publishing.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { PublishingStatus } from '@prisma/client';

describe('ProductPublishingService', () => {
  let service: ProductPublishingService;

  beforeEach(async () => {
    const prisma = {
      products: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'prod-1',
          publishingStatus: PublishingStatus.DRAFT,
        }),
        update: jest.fn().mockImplementation((args) =>
          Promise.resolve({
            id: 'prod-1',
            publishingStatus: args.data.publishingStatus,
          }),
        ),
      },
    };

    const eventBus = { publish: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPublishingService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ProductPublishingService>(ProductPublishingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update product publishing workflow status', async () => {
    const res = await service.updatePublishingStatus('prod-1', {
      publishingStatus: PublishingStatus.PUBLISHED,
    });
    expect(res).toBeDefined();
    expect(res.publishingStatus).toBe(PublishingStatus.PUBLISHED);
  });
});
