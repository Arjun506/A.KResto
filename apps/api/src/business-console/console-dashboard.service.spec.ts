import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleDashboardService } from './console-dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('ConsoleDashboardService', () => {
  let service: ConsoleDashboardService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      console_dashboards: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsoleDashboardService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ConsoleDashboardService>(ConsoleDashboardService);
  });

  it('should save personalized layout configs and emit update events', async () => {
    prisma.console_dashboards.create.mockResolvedValue({
      id: 'dash_1',
      name: 'Ops Dash',
      layoutJson: {},
    });

    const result = await service.saveDashboardLayout(
      't_1',
      'user_1',
      'Ops Dash',
      {},
    );

    expect(prisma.console_dashboards.create).toHaveBeenCalled();
    expect(result.id).toEqual('dash_1');
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
