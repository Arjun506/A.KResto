import { Test, TestingModule } from '@nestjs/testing';
import { StateMachineService } from './state-machine.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('StateMachineService', () => {
  let service: StateMachineService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      workflow_instances: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateMachineService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<StateMachineService>(StateMachineService);
  });

  it('should execute workflow transitions and trigger event state broadcasts', async () => {
    const mockInst = { id: 'inst_1', currentStep: 'START', tenantId: 't_1' };
    prisma.workflow_instances.findUnique.mockResolvedValue(mockInst);
    prisma.workflow_instances.update.mockResolvedValue({
      ...mockInst,
      currentStep: 'STEP_1',
    });

    const result = await service.executeStep('inst_1', 'STEP_1', {
      amount: 100,
    });

    expect(prisma.workflow_instances.update).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result.currentStep).toEqual('STEP_1');
  });
});
