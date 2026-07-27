import { Test, TestingModule } from '@nestjs/testing';
import { PackHealthService } from './pack-health.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('PackHealthService', () => {
  let service: PackHealthService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      platform_packs: {
        findUnique: jest.fn(),
      },
      platform_pack_health: {
        create: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackHealthService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PackHealthService>(PackHealthService);
  });

  it('should track runtime operational health scores', async () => {
    prisma.platform_packs.findUnique.mockResolvedValue({
      id: 'pack_1',
      code: 'rest-pack',
    });
    prisma.platform_pack_health.create.mockResolvedValue({
      id: 'health_1',
      healthScore: 95,
    });

    const result = await service.reportHealth('pack_1', 95);

    expect(prisma.platform_pack_health.create).toHaveBeenCalled();
    expect(result.healthScore).toEqual(95);
  });

  it('should trigger alert event when health score drops below threshold limits', async () => {
    prisma.platform_packs.findUnique.mockResolvedValue({
      id: 'pack_1',
      code: 'rest-pack',
    });
    prisma.platform_pack_health.create.mockResolvedValue({
      id: 'health_2',
      healthScore: 60,
    });

    await service.reportHealth('pack_1', 60, { connectionCount: 0 });

    expect(eventBus.publish).toHaveBeenCalled();
  });
});
