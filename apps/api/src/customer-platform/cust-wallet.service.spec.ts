import { Test, TestingModule } from '@nestjs/testing';
import { CustWalletService } from './cust-wallet.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CustWalletService', () => {
  let service: CustWalletService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      cust_wallet_ledger: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustWalletService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CustWalletService>(CustWalletService);
  });

  it('should manage credits in digital wallets ledgers', async () => {
    prisma.cust_wallet_ledger.upsert.mockResolvedValue({
      customerId: 'cust_1',
      balance: 50.0,
    });

    const result = await service.creditWallet('cust_1', 50.0);

    expect(prisma.cust_wallet_ledger.upsert).toHaveBeenCalled();
    expect(result.balance).toEqual(50.0);
  });
});
