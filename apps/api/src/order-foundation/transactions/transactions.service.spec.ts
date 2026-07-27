import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      transactions_registry: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should create a new universal commercial transaction', async () => {
    const dto = {
      transactionNumber: 'TX-01',
      transactionType: 'QUOTE',
      amount: 500,
    };

    const mockTx = { id: 'tx_1', ...dto, currency: 'USD', status: 'COMPLETED' };
    prisma.transactions_registry.create.mockResolvedValue(mockTx);

    const result = await service.createTransaction(dto);

    expect(prisma.transactions_registry.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockTx);
  });
});
