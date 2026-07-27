import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { OrganizationRepository } from './organization.repository';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const repository = {
      findOrganizationById: jest.fn().mockImplementation((id: string) => {
        if (id === 'org-1') {
          return Promise.resolve({
            id: 'org-1',
            tenantId: 'tenant-1',
            name: 'Acme Corp',
            code: 'ACME',
            businesses: [],
          });
        }
        return Promise.resolve(null);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: OrganizationRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return organization by id', async () => {
    const org = await service.getOrganizationById('org-1');
    expect(org).toBeDefined();
    expect(org.name).toBe('Acme Corp');
  });
});
