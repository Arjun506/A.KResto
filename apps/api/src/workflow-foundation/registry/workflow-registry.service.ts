import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowDefinitionDto } from './dto/create-workflow.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  WorkflowCreatedEvent,
  WorkflowPublishedEvent,
  WorkflowVersionCreatedEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class WorkflowRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createDefinition(dto: CreateWorkflowDefinitionDto) {
    const existing = await this.prisma.workflow_definitions.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Workflow definition with code ${dto.code} already exists`,
      );
    }

    const definition = await this.prisma.workflow_definitions.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        code: dto.code,
        description: dto.description,
        version: 1,
        status: 'DRAFT',
        definitionJson: dto.definitionJson,
        canvasMetadata: dto.canvasMetadata,
      },
    });

    await this.eventBus.publish(
      new WorkflowCreatedEvent(
        definition.id,
        {
          workflowId: definition.id,
          code: definition.code,
          version: definition.version,
        },
        definition.tenantId || undefined,
      ),
    );

    return definition;
  }

  async publishDefinition(id: string) {
    const def = await this.prisma.workflow_definitions.findUnique({
      where: { id },
    });
    if (!def) {
      throw new NotFoundException(`Workflow definition ${id} not found`);
    }

    const updated = await this.prisma.workflow_definitions.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    await this.eventBus.publish(
      new WorkflowPublishedEvent(
        updated.id,
        {
          workflowId: updated.id,
          code: updated.code,
          version: updated.version,
        },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async createNewVersion(code: string, definitionJson: any) {
    const latest = await this.prisma.workflow_definitions.findUnique({
      where: { code },
    });
    if (!latest) {
      throw new NotFoundException(`Workflow definition code ${code} not found`);
    }

    const nextVer = latest.version + 1;

    const newDef = await this.prisma.workflow_definitions.update({
      where: { code },
      data: {
        definitionJson,
        version: nextVer,
        status: 'DRAFT',
      },
    });

    await this.eventBus.publish(
      new WorkflowVersionCreatedEvent(
        newDef.id,
        { workflowId: newDef.id, code: newDef.code, version: nextVer },
        newDef.tenantId || undefined,
      ),
    );

    return newDef;
  }

  async getDefinition(id: string) {
    return this.prisma.workflow_definitions.findUnique({ where: { id } });
  }

  async listDefinitions(tenantId?: string) {
    const where = tenantId
      ? { tenantId, deletedAt: null }
      : { deletedAt: null };
    return this.prisma.workflow_definitions.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }
}
