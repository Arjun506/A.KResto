import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketsService } from './support-tickets.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('SupportTicketsService', () => {
  let service: SupportTicketsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      crm_tickets: {
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
        SupportTicketsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<SupportTicketsService>(SupportTicketsService);
  });

  it('should create tickets and resolve status bounds', async () => {
    const dto = {
      ticketNumber: 'T-01',
      title: 'Broken Product',
      priority: 'HIGH',
    };

    prisma.crm_tickets.findUnique.mockResolvedValue(null);
    const mockTkt = { id: 'tkt_1', ...dto, status: 'NEW', tenantId: 't_1' };
    prisma.crm_tickets.create.mockResolvedValue(mockTkt);

    const result = await service.createTicket(dto);

    expect(prisma.crm_tickets.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockTkt);
  });
});
