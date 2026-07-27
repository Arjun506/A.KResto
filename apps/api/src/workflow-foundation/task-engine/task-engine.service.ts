import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowTaskDto } from './dto/create-task.dto';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  TaskCreatedEvent,
  TaskAssignedEvent,
  TaskDelegatedEvent,
  TaskCompletedEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class TaskEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createTask(dto: CreateWorkflowTaskDto) {
    const task = await this.prisma.workflow_tasks.create({
      data: {
        tenantId: dto.tenantId,
        workflowInstanceId: dto.workflowInstanceId,
        title: dto.title,
        description: dto.description,
        status: dto.assignedTo ? 'ASSIGNED' : 'PENDING',
        assignedTo: dto.assignedTo,
        formId: dto.formId,
      },
    });

    await this.eventBus.publish(
      new TaskCreatedEvent(
        task.id,
        {
          taskId: task.id,
          instanceId: dto.workflowInstanceId || 'NONE',
          title: task.title,
        },
        task.tenantId || undefined,
      ),
    );

    if (dto.assignedTo) {
      await this.eventBus.publish(
        new TaskAssignedEvent(
          task.id,
          { taskId: task.id, assignedTo: dto.assignedTo },
          task.tenantId || undefined,
        ),
      );
    }

    return task;
  }

  async delegateTask(id: string, delegatedTo: string) {
    const task = await this.prisma.workflow_tasks.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    const updated = await this.prisma.workflow_tasks.update({
      where: { id },
      data: {
        delegatedTo,
        status: 'DELEGATED',
      },
    });

    await this.eventBus.publish(
      new TaskDelegatedEvent(
        id,
        { taskId: id, delegatedTo },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async completeTask(id: string, status: string = 'COMPLETED') {
    const task = await this.prisma.workflow_tasks.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    const updated = await this.prisma.workflow_tasks.update({
      where: { id },
      data: { status },
    });

    await this.eventBus.publish(
      new TaskCompletedEvent(
        id,
        { taskId: id, status },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async getUserInbox(userId: string) {
    return this.prisma.workflow_tasks.findMany({
      where: {
        OR: [{ assignedTo: userId }, { delegatedTo: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
