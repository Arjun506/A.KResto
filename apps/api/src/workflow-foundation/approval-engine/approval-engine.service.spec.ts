import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalEngineService } from './approval-engine.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('ApprovalEngineService', () => {
  let service: ApprovalEngineService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      workflow_approvals: {
        create: jest.fn(),
        update: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalEngineService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ApprovalEngineService>(ApprovalEngineService);
  });

  it('should process user approvals and publish sign-off events', async () => {
    const mockApp = {
      id: 'app_1',
      stepName: 'Step_A',
      tenantId: 't_1',
      status: 'PENDING',
    };
    prisma.workflow_approvals.findUnique.mockResolvedValue(mockApp);
    prisma.workflow_approvals.update.mockResolvedValue({
      ...mockApp,
      status: 'APPROVED',
    });

    const result = await service.grantApproval('app_1', 'user_1', 'Looks good');

    expect(prisma.workflow_approvals.update).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.status).toEqual('APPROVED');
  });
});
