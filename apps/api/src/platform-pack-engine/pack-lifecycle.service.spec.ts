import { Test, TestingModule } from '@nestjs/testing';
import { PackLifecycleService } from './pack-lifecycle.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('PackLifecycleService', () => {
  let service: PackLifecycleService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      platform_packs: {
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      platform_pack_installations: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackLifecycleService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PackLifecycleService>(PackLifecycleService);
  });

  it('should transition pack lifecycle statuses and emit change events', async () => {
    prisma.platform_packs.findUnique.mockResolvedValue({
      id: 'pack_1',
      code: 'rest-pack',
      status: 'INSTALLED',
    });
    prisma.platform_packs.update.mockResolvedValue({
      id: 'pack_1',
      status: 'ACTIVE',
    });

    const result = await service.activatePack('pack_1', 't_1');

    expect(prisma.platform_packs.update).toHaveBeenCalledWith({
      where: { id: 'pack_1' },
      data: { status: 'ACTIVE' },
    });
    expect(result.status).toEqual('ACTIVE');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
