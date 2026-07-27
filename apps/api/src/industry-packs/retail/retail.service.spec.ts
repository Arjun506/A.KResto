import { Test, TestingModule } from '@nestjs/testing';
import { RetailService } from './retail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('RetailService', () => {
  let service: RetailService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      retail_stores: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      retail_registers: {
        create: jest.fn(),
      },
      retail_product_variants: {
        create: jest.fn(),
      },
      retail_stock_batches: {
        create: jest.fn(),
      },
      retail_promotions: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      retail_purchase_orders: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      retail_suppliers: {
        create: jest.fn(),
      },
      retail_returns: {
        create: jest.fn(),
      },
      orders: {
        create: jest.fn(),
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
        RetailService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<RetailService>(RetailService);
  });

  it('should process POS checkouts applying promotion discounts and register sales orders', async () => {
    prisma.retail_promotions.findUnique.mockResolvedValue({
      id: 'promo_1',
      code: 'SUMMER20',
      discountPercent: 20,
    });
    prisma.orders.create.mockResolvedValue({ id: 'ord_1', totalAmount: 80 });
    prisma.payment_transactions.create.mockResolvedValue({ id: 'pay_1' });

    const result = await service.checkoutPOS(
      't_1',
      'reg_1',
      'RTL-1002',
      [{ productId: 'prod_1', qty: 1, price: 100 }],
      'SUMMER20',
    );

    expect(prisma.orders.create).toHaveBeenCalled();
    expect(result.finalTotal).toEqual(80);
    expect(result.discountApplied).toEqual(20);
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should process purchase orders receive workflows and calculate retail analytics', async () => {
    prisma.retail_purchase_orders.findUnique.mockResolvedValue({
      id: 'po_1',
      supplierId: 'sup_1',
      tenantId: 't_1',
    });
    prisma.retail_purchase_orders.update.mockResolvedValue({
      id: 'po_1',
      status: 'RECEIVED',
    });
    prisma.retail_purchase_orders.findMany.mockResolvedValue([{ id: 'po_1' }]);
    prisma.retail_stores.findMany.mockResolvedValue([{ id: 'store_1' }]);

    const receive = await service.receivePurchaseOrder('po_1');
    const analytics = await service.fetchRetailAnalytics('t_1');

    expect(prisma.retail_purchase_orders.update).toHaveBeenCalled();
    expect(receive.status).toEqual('RECEIVED');
    expect(analytics.storesCount).toEqual(1);
    expect(analytics.purchaseOrdersCount).toEqual(1);
  });
});
