import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { AuditRepository } from './audit.repository';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const repository = {
      create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      findLogs: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: AuditRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should query audit logs', async () => {
    const res = await service.getAuditLogs({ page: 1, limit: 10 });
    expect(res).toBeDefined();
    expect(res.items).toEqual([]);
  });
});
