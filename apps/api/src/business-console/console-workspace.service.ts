import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  WorkspaceSwitchedEvent,
  ViewBookmarkedEvent,
} from '../event-bus/events/console.events';

@Injectable()
export class ConsoleWorkspaceService {
  private recentWorkspacesHistory = new Map<string, string[]>(); // userId -> codes

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async createWorkspace(
    tenantId: string,
    code: string,
    name: string,
    settings?: any,
  ) {
    return this.prisma.console_workspaces.create({
      data: {
        tenantId,
        code,
        name,
        settingsJson: settings || {},
      },
    });
  }

  async switchWorkspace(
    tenantId: string,
    userId: string,
    workspaceCode: string,
  ) {
    const workspace = await this.prisma.console_workspaces.findUnique({
      where: { code: workspaceCode },
    });
    if (!workspace) {
      throw new NotFoundException(`Workspace ${workspaceCode} not found`);
    }

    // Update history cache
    const history = this.recentWorkspacesHistory.get(userId) || [];
    const updated = [
      workspaceCode,
      ...history.filter((w) => w !== workspaceCode),
    ].slice(0, 5);
    this.recentWorkspacesHistory.set(userId, updated);

    await this.eventBus.publish(
      new WorkspaceSwitchedEvent(
        workspace.id,
        { workspaceCode, userId },
        tenantId,
      ),
    );

    return {
      workspace,
      recentHistory: updated,
    };
  }

  async getRecentHistory(userId: string) {
    return this.recentWorkspacesHistory.get(userId) || [];
  }

  async bookmarkView(
    tenantId: string,
    userId: string,
    pageCode: string,
    filters?: any,
  ) {
    const view = await this.prisma.console_saved_views.create({
      data: {
        tenantId,
        userId,
        pageCode,
        filtersJson: filters || {},
      },
    });

    await this.eventBus.publish(
      new ViewBookmarkedEvent(view.id, { pageCode, userId }, tenantId),
    );

    return view;
  }
}
