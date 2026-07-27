import { Test, TestingModule } from '@nestjs/testing';
import { PackRegistryService } from './pack-registry.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('PackRegistryService', () => {
  let service: PackRegistryService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      platform_packs: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      platform_pack_versions: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackRegistryService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PackRegistryService>(PackRegistryService);
  });

  it('should upload a new industry pack registry metadata', async () => {
    prisma.platform_packs.findUnique.mockResolvedValue(null);
    prisma.platform_packs.create.mockResolvedValue({
      id: 'pack_1',
      code: 'rest-pack',
      name: 'Restaurant Pack',
    });

    const result = await service.uploadPack('rest-pack', 'Restaurant Pack');

    expect(prisma.platform_packs.create).toHaveBeenCalled();
    expect(result.id).toEqual('pack_1');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
