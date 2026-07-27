import { Test, TestingModule } from '@nestjs/testing';
import { WalletFoundationService } from './wallet-foundation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('WalletFoundationService', () => {
  let service: WalletFoundationService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      customer_wallets: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      wallet_ledger: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletFoundationService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<WalletFoundationService>(WalletFoundationService);
  });

  it('should credit a customer wallet successfully', async () => {
    const mockWallet = {
      id: 'w_1',
      customerId: 'c_1',
      currency: 'USD',
      balance: 50,
    };
    prisma.customer_wallets.findUnique.mockResolvedValue(mockWallet);
    prisma.customer_wallets.update.mockResolvedValue({
      ...mockWallet,
      balance: 100,
    });

    const result = await service.creditWallet('c_1', 50);

    expect(prisma.customer_wallets.update).toHaveBeenCalled();
    expect(prisma.wallet_ledger.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.balance).toEqual(100);
  });
});
