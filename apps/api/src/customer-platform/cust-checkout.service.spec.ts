import { Test, TestingModule } from '@nestjs/testing';
import { CustCheckoutService } from './cust-checkout.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';

describe('CustCheckoutService', () => {
  let service: CustCheckoutService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      cust_carts: {
        create: jest.fn(),
      },
      universal_orders: {
        create: jest.fn(),
      },
      payment_transactions: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustCheckoutService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<CustCheckoutService>(CustCheckoutService);
  });

  it('should process dynamic shopping checkout workflows', async () => {
    prisma.universal_orders.create.mockResolvedValue({
      id: 'ord_1',
      orderNumber: 'C-1',
    });
    prisma.payment_transactions.create.mockResolvedValue({
      id: 'pay_1',
      amount: 100,
    });

    const result = await service.processCheckout('t_1', 'cust_1', 'biz_1', 100);

    expect(prisma.universal_orders.create).toHaveBeenCalled();
    expect(prisma.payment_transactions.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.status).toEqual('PAID');
  });
});
