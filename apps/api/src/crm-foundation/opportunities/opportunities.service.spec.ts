import { Test, TestingModule } from '@nestjs/testing';
import { OpportunitiesService } from './opportunities.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('OpportunitiesService', () => {
  let service: OpportunitiesService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      crm_opportunities: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunitiesService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<OpportunitiesService>(OpportunitiesService);
  });

  it('should transition deal stages and broadcast status events', async () => {
    const mockOpp = {
      id: 'opp_1',
      title: 'Deal 1',
      stage: 'PROSPECTING',
      tenantId: 't_1',
      estimatedValue: 5000,
    };
    prisma.crm_opportunities.findUnique.mockResolvedValue(mockOpp);
    prisma.crm_opportunities.update.mockResolvedValue({
      ...mockOpp,
      stage: 'WON',
    });

    const result = await service.updateStage('opp_1', 'WON');

    expect(prisma.crm_opportunities.update).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.stage).toEqual('WON');
  });
});
