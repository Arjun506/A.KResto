import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowRegistryService } from './workflow-registry.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('WorkflowRegistryService', () => {
  let service: WorkflowRegistryService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      workflow_definitions: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowRegistryService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<WorkflowRegistryService>(WorkflowRegistryService);
  });

  it('should create workflow definitions and emit event', async () => {
    const dto = {
      name: 'Test Flow',
      code: 'FLOW-01',
      definitionJson: { initialStep: 'START' },
      canvasMetadata: { layout: 'GRID' },
    };

    prisma.workflow_definitions.findUnique.mockResolvedValue(null);
    const mockDef = { id: 'def_1', ...dto, version: 1, status: 'DRAFT' };
    prisma.workflow_definitions.create.mockResolvedValue(mockDef);

    const result = await service.createDefinition(dto);

    expect(prisma.workflow_definitions.create).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(result).toEqual(mockDef);
  });
});
