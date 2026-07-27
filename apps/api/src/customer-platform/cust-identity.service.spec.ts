import { Test, TestingModule } from '@nestjs/testing';
import { CustIdentityService } from './cust-identity.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CustIdentityService', () => {
  let service: CustIdentityService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      customers: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustIdentityService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CustIdentityService>(CustIdentityService);
  });

  it('should fetch federated profile schemas details', async () => {
    prisma.customers.findUnique.mockResolvedValue({
      id: 'cust_1',
      profile: { firstName: 'Alice', lastName: 'Green' },
      contacts: [{ type: 'PRIMARY_EMAIL', value: 'alice@test.com' }],
      custConsent: null,
      custWallet: null,
    });

    const result = await service.getCustomerFederatedProfile('cust_1');

    expect(prisma.customers.findUnique).toHaveBeenCalled();
    expect(result.name).toEqual('Alice Green');
  });
});
