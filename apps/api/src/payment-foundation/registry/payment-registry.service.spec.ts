import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRegistryService } from './payment-registry.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('PaymentRegistryService', () => {
  let service: PaymentRegistryService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      payment_transactions: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRegistryService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PaymentRegistryService>(PaymentRegistryService);
  });

  it('should register a new payment transaction record', async () => {
    const dto = {
      paymentNumber: 'PMT-01',
      methodType: 'CREDIT_CARD' as any,
      amount: 100,
    };

    prisma.payment_transactions.findUnique.mockResolvedValue(null);
    const mockPmt = { id: 'pmt_1', ...dto, status: 'PENDING' };
    prisma.payment_transactions.create.mockResolvedValue(mockPmt);

    const result = await service.createPayment(dto);

    expect(prisma.payment_transactions.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockPmt);
  });
});
