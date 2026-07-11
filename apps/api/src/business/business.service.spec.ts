import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PlanTier } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { BusinessService } from './business.service';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';

describe('BusinessService', () => {
  let service: BusinessService;

  const prismaMock = {
    tenant: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tenant_features: { create: jest.fn() },
    branch: { create: jest.fn() },
    roles_permissions: { create: jest.fn() },
    subscriptions: { create: jest.fn() },
    audit_logs: { create: jest.fn() },
    $transaction: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue('test-jwt-token'),
  };

  const baseDto: CreateWorkspaceDto = {
    businessName: 'Test Bistro',
    industry: 'RESTAURANT',
    ownerName: 'Jane Owner',
    ownerEmail: 'jane.owner@example.com',
    ownerPassword: 'secret123',
    currency: 'USD',
    timezone: 'UTC',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get(BusinessService);
  });

  describe('lookup endpoints', () => {
    it('returns supported industries', () => {
      const industries = service.getIndustries();
      expect(industries.length).toBeGreaterThan(0);
      expect(industries.some((item) => item.id === 'RESTAURANT')).toBe(true);
    });

    it('returns supported currencies', () => {
      const currencies = service.getCurrencies();
      expect(currencies.some((item) => item.code === 'USD')).toBe(true);
    });

    it('returns supported timezones', () => {
      const timezones = service.getTimezones();
      expect(timezones.some((item) => item.id === 'UTC')).toBe(true);
    });
  });

  describe('checkBusinessName', () => {
    it('marks a unique name as available', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue(null);
      prismaMock.tenant.findUnique.mockResolvedValue(null);

      const result = await service.checkBusinessName('Fresh Cafe');

      expect(result.available).toBe(true);
      expect(result.slug).toBe('fresh-cafe');
    });

    it('marks duplicate names as unavailable', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue({ id: 'tenant-1' });
      prismaMock.tenant.findUnique.mockResolvedValue(null);

      const result = await service.checkBusinessName('Fresh Cafe');

      expect(result.available).toBe(false);
      expect(result.reason).toContain('Business name');
    });
  });

  describe('createWorkspace', () => {
    it('rejects duplicate business names before provisioning', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue({ id: 'tenant-1' });
      prismaMock.tenant.findUnique.mockResolvedValue(null);

      await expect(service.createWorkspace(baseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('rejects duplicate owner emails before provisioning', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue(null);
      prismaMock.tenant.findUnique.mockResolvedValue(null);
      prismaMock.users.findUnique.mockResolvedValue({ id: 'user-1' });

      await expect(service.createWorkspace(baseDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('rolls back when a transaction step fails', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue(null);
      prismaMock.tenant.findUnique.mockResolvedValue(null);
      prismaMock.users.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockRejectedValue(
        new Error('transaction failed'),
      );

      await expect(service.createWorkspace(baseDto)).rejects.toThrow(
        'transaction failed',
      );
    });

    it('provisions workspace entities in one transaction', async () => {
      prismaMock.tenant.findFirst.mockResolvedValue(null);
      prismaMock.tenant.findUnique.mockResolvedValue(null);
      prismaMock.users.findUnique.mockResolvedValue(null);

      const tenant = {
        id: 'tenant-1',
        name: baseDto.businessName,
        slug: 'test-bistro',
        industry: 'RESTAURANT',
        status: 'ACTIVE',
        currency: 'USD',
        timezone: 'UTC',
        language: 'en',
      };
      const owner = {
        id: 'user-1',
        name: baseDto.ownerName,
        email: baseDto.ownerEmail,
        role: 'RESTAURANT_OWNER',
      };
      const branch = {
        id: 'branch-1',
        name: 'Main Branch',
        code: 'MAIN',
        isActive: true,
      };
      const subscription = {
        id: 'sub-1',
        planName: PlanTier.TRIAL,
        status: 'TRIALING',
        billingEmail: baseDto.ownerEmail,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
      };

      prismaMock.$transaction.mockImplementation(async (callback) =>
        callback({
          tenant: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(tenant),
          },
          users: {
            findUnique: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(owner),
          },
          tenant_features: { create: jest.fn().mockResolvedValue({}) },
          branch: { create: jest.fn().mockResolvedValue(branch) },
          roles_permissions: { create: jest.fn().mockResolvedValue({}) },
          subscriptions: { create: jest.fn().mockResolvedValue(subscription) },
          audit_logs: { create: jest.fn().mockResolvedValue({}) },
        }),
      );

      const result = await service.createWorkspace(baseDto);

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(result.access_token).toBe('test-jwt-token');
      expect(result.business.name).toBe(baseDto.businessName);
      expect(result.owner.email).toBe(baseDto.ownerEmail);
      expect(result.branch.code).toBe('MAIN');
      expect(result.subscription.planName).toBe(PlanTier.TRIAL);
      expect(result.modules.length).toBeGreaterThan(0);
      expect(result.roles).toContain('RESTAURANT_OWNER');
    });
  });
});
