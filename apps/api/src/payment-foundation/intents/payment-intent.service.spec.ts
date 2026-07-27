import { Test, TestingModule } from '@nestjs/testing';
import { PaymentIntentService } from './payment-intent.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('PaymentIntentService', () => {
  let service: PaymentIntentService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      payment_intents: {
        findFirst: jest.fn(),
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
        PaymentIntentService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<PaymentIntentService>(PaymentIntentService);
  });

  it('should create payment intents and emit event', async () => {
    const dto = {
      intentNumber: 'INT-01',
      amount: 150,
      currency: 'USD',
    };

    prisma.payment_intents.findUnique.mockResolvedValue(null);
    const mockIntent = { id: 'int_1', ...dto, status: 'PENDING' };
    prisma.payment_intents.create.mockResolvedValue(mockIntent);

    const result = await service.createIntent(dto);

    expect(prisma.payment_intents.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockIntent);
  });
});
