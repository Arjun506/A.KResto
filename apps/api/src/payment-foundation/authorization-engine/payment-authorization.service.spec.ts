import { Test, TestingModule } from '@nestjs/testing';
import { PaymentAuthorizationService } from './payment-authorization.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GatewayAdapterFactory } from '../gateway-abstraction/gateway-adapter.factory';
import { EventBusService } from '../../event-bus/event-bus.service';
import { GatewayHealthMonitorService } from '../health-monitor/health-monitor.service';

describe('PaymentAuthorizationService', () => {
  let service: PaymentAuthorizationService;
  let prisma: any;
  let adapterFactory: any;
  let eventBus: any;
  let healthMonitor: any;

  beforeEach(async () => {
    prisma = {
      payment_transactions: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    adapterFactory = {
      getAdapter: jest.fn().mockReturnValue({
        authorize: jest.fn().mockResolvedValue({
          success: true,
          transactionRef: 'REF-1',
          authCode: '123456',
          feeAmount: 2.5,
        }),
      }),
    };

    eventBus = {
      publish: jest.fn(),
    };

    healthMonitor = {
      trackHealth: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentAuthorizationService,
        { provide: PrismaService, useValue: prisma },
        { provide: GatewayAdapterFactory, useValue: adapterFactory },
        { provide: EventBusService, useValue: eventBus },
        { provide: GatewayHealthMonitorService, useValue: healthMonitor },
      ],
    }).compile();

    service = module.get<PaymentAuthorizationService>(
      PaymentAuthorizationService,
    );
  });

  it('should authorize a payment successfully', async () => {
    const mockPmt = {
      id: 'pmt_1',
      amount: 100,
      currency: 'USD',
      status: 'PENDING',
      gatewayName: 'MOCK',
    };
    prisma.payment_transactions.findUnique.mockResolvedValue(mockPmt);
    prisma.payment_transactions.update.mockResolvedValue({
      ...mockPmt,
      status: 'AUTHORIZED',
    });

    const result = await service.authorizePayment('pmt_1', 'tok_1');

    expect(prisma.payment_transactions.update).toHaveBeenCalledWith({
      where: { id: 'pmt_1' },
      data: {
        status: 'AUTHORIZED',
        authorizedAmount: 100,
        gatewayRef: 'REF-1',
        authCode: '123456',
        feeAmount: 2.5,
      },
    });
    expect(eventBus.publish).toHaveBeenCalled();
  });
});
