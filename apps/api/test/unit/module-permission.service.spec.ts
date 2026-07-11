import { Test } from '@nestjs/testing';
import { ModulePermissionService } from '../../src/module-platform/permissions/module-permission.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrisma: any = {
  roles_permissions: {
    findUnique: jest.fn(),
  },
  tenant_features: {
    findUnique: jest.fn(),
  },
};

describe('ModulePermissionService (unit)', () => {
  let service: ModulePermissionService;

  beforeEach(async () => {
    mockPrisma.roles_permissions.findUnique.mockReset();
    mockPrisma.tenant_features.findUnique.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ModulePermissionService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = moduleRef.get(ModulePermissionService);
  });

  it('can() returns true when tenant role mapping contains required permission', async () => {
    mockPrisma.roles_permissions.findUnique.mockResolvedValue({
      permissions: ['dashboard:read', 'analytics:read'],
    });

    await expect(service.can('MANAGER', 'dashboard:read', 't1')).resolves.toBe(
      true,
    );
  });

  it('can() returns true when tenant role mapping contains wildcard *', async () => {
    mockPrisma.roles_permissions.findUnique.mockResolvedValue({
      permissions: ['*'],
    });

    await expect(service.can('MANAGER', 'anything:read', 't1')).resolves.toBe(
      true,
    );
  });

  it('can() returns false when tenant role mapping does not include required permission', async () => {
    mockPrisma.roles_permissions.findUnique.mockResolvedValue({
      permissions: ['other:read'],
    });

    await expect(service.can('MANAGER', 'dashboard:read', 't1')).resolves.toBe(
      false,
    );
  });

  it('can() returns false when tenant role mapping is missing', async () => {
    mockPrisma.roles_permissions.findUnique.mockResolvedValue(null);

    await expect(service.can('MANAGER', 'dashboard:read', 't1')).resolves.toBe(
      false,
    );
  });

  it('featureFlagEnabled() returns false when feature flag is missing', async () => {
    mockPrisma.tenant_features.findUnique.mockResolvedValue(null);

    await expect(service.featureFlagEnabled('t1', 'analytics')).resolves.toBe(
      false,
    );
  });

  it('featureFlagEnabled() returns false when feature flag exists but isDisabled', async () => {
    mockPrisma.tenant_features.findUnique.mockResolvedValue({
      isEnabled: false,
    });

    await expect(service.featureFlagEnabled('t1', 'analytics')).resolves.toBe(
      false,
    );
  });

  it('featureFlagEnabled() returns true when feature flag exists and isEnabled', async () => {
    mockPrisma.tenant_features.findUnique.mockResolvedValue({
      isEnabled: true,
    });

    await expect(service.featureFlagEnabled('t1', 'analytics')).resolves.toBe(
      true,
    );
  });

  it('featureFlagEnabled() returns true when no featureFlagKey is provided', async () => {
    await expect(service.featureFlagEnabled('t1', undefined)).resolves.toBe(
      true,
    );
  });
});
