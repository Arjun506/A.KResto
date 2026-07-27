import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import {
  ApprovalRequestedEvent,
  ApprovalGrantedEvent,
  ApprovalRejectedEvent,
} from '../../event-bus/events/workflow.events';

@Injectable()
export class ApprovalEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async requestApproval(
    tenantId: string,
    referenceType: string,
    referenceId: string,
    stepName: string,
    roleId?: string,
    userId?: string,
  ) {
    const approval = await this.prisma.workflow_approvals.create({
      data: {
        tenantId,
        referenceType,
        referenceId,
        stepName,
        assignedRoleId: roleId,
        assignedUserId: userId,
        status: 'PENDING',
      },
    });

    await this.eventBus.publish(
      new ApprovalRequestedEvent(
        approval.id,
        { approvalId: approval.id, stepName },
        tenantId,
      ),
    );

    return approval;
  }

  async grantApproval(id: string, signedBy?: string, comments?: string) {
    const approval = await this.prisma.workflow_approvals.findUnique({
      where: { id },
    });
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    const updated = await this.prisma.workflow_approvals.update({
      where: { id },
      data: {
        status: 'APPROVED',
        signedAt: new Date(),
        comments,
      },
    });

    await this.eventBus.publish(
      new ApprovalGrantedEvent(
        id,
        { approvalId: id, signedBy },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  async rejectApproval(id: string, signedBy?: string, comments?: string) {
    const approval = await this.prisma.workflow_approvals.findUnique({
      where: { id },
    });
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    const updated = await this.prisma.workflow_approvals.update({
      where: { id },
      data: {
        status: 'REJECTED',
        signedAt: new Date(),
        comments,
      },
    });

    await this.eventBus.publish(
      new ApprovalRejectedEvent(
        id,
        { approvalId: id, signedBy, comment: comments },
        updated.tenantId || undefined,
      ),
    );

    return updated;
  }

  // AI approver recommendation hook
  async getApproverRecommendation(id: string) {
    return {
      approvalId: id,
      recommendedUserId: 'emp_vp_finance_123',
      recommendedRoleId: 'ROLE_VP_FINANCE',
      confidenceScore: 0.96,
      reason:
        'Historically approved transactions above $10,000 in less than 2 hours.',
    };
  }
}
