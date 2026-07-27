import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      crm_leads: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('should create lead cards and dispatch events', async () => {
    const dto = {
      leadNumber: 'L-01',
      name: 'Test Lead',
      sourceString: 'Ads',
    };

    prisma.crm_leads.findUnique.mockResolvedValue(null);
    const mockLead = { id: 'lead_1', ...dto, status: 'NEW', tenantId: 't_1' };
    prisma.crm_leads.create.mockResolvedValue(mockLead);

    const result = await service.createLead(dto);

    expect(prisma.crm_leads.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockLead);
  });
});
