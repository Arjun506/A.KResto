import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantOpsService } from './restaurant-ops.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventBusService } from '../../../event-bus/event-bus.service';

describe('RestaurantOpsService', () => {
  let service: RestaurantOpsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      rest_shifts: {
        create: jest.fn(),
      },
      universal_orders: {
        create: jest.fn(),
        update: jest.fn(),
      },
      payment_transactions: {
        create: jest.fn(),
      },
      crm_loyalty: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantOpsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<RestaurantOpsService>(RestaurantOpsService);
  });

  it('should process sales checkouts and earn customer loyalty points', async () => {
    const dto = {
      tableNumber: 'T-12',
      amount: 40,
      customerId: 'cust_1',
      items: [{ dishProductId: 'prod_1', quantity: 1 }],
    };

    const mockOrder = {
      id: 'ord_1',
      orderNumber: 'RST-ORD-12',
      tenantId: 't_1',
    };
    prisma.universal_orders.create.mockResolvedValue(mockOrder);
    prisma.universal_orders.update.mockResolvedValue(mockOrder);

    const mockPay = { id: 'pay_1', amount: 40, tenantId: 't_1' };
    prisma.payment_transactions.create.mockResolvedValue(mockPay);

    const mockLoyalty = { id: 'loyalty_1', pointsTotal: 100, tenantId: 't_1' };
    prisma.crm_loyalty.findUnique.mockResolvedValue(mockLoyalty);

    const result = await service.checkoutOrder('t_1', dto);

    expect(prisma.universal_orders.create).toHaveBeenCalled();
    expect(prisma.payment_transactions.create).toHaveBeenCalled();
    expect(prisma.crm_loyalty.findUnique).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.status).toEqual('PAID');
  });
});
