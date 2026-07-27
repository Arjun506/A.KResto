import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// AuthService (RC2 fix) requires this env var for HMAC hashing.
process.env.AUTH_TOKEN_PEPPER = process.env.AUTH_TOKEN_PEPPER ?? 'test-pepper';

const mockPrisma = {
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  tenant: {
    findFirst: jest.fn().mockResolvedValue({ id: 'rest-1' }),
  },
  audit_logs: {
    create: jest.fn().mockResolvedValue({}),
  },
};

const mockJwtService = {
  sign: jest.fn(() => 'mock_token'),
  signAsync: jest.fn().mockResolvedValue('mock_token'),
  verify: jest.fn(() => ({ id: 'user-id', email: 'owner@akresto.com' })),
  verifyAsync: jest.fn().mockResolvedValue({
    id: 'user-id',
    email: 'owner@akresto.com',
    sub: 'user-id',
    type: 'refresh',
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
