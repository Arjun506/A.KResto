import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { DashboardLayoutSavedEvent } from '../event-bus/events/console.events';

@Injectable()
export class ConsoleDashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async saveDashboardLayout(
    tenantId: string,
    userId: string,
    name: string,
    layout: any,
    isDefault = false,
  ) {
    const dashboard = await this.prisma.console_dashboards.create({
      data: {
        tenantId,
        userId,
        name,
        layoutJson: layout,
        isDefault,
      },
    });

    await this.eventBus.publish(
      new DashboardLayoutSavedEvent(
        dashboard.id,
        { dashboardId: dashboard.id, userId },
        tenantId,
      ),
    );

    return dashboard;
  }

  async getDashboardLayout(id: string) {
    const dashboard = await this.prisma.console_dashboards.findUnique({
      where: { id },
    });
    if (!dashboard) {
      throw new NotFoundException(`Dashboard ${id} not found`);
    }
    return dashboard;
  }

  async registerWidget(
    tenantId: string,
    code: string,
    title: string,
    type: string,
    schema: any,
    packId?: string,
  ) {
    return this.prisma.console_widgets.create({
      data: {
        tenantId,
        code,
        title,
        type,
        configSchema: schema,
        packId,
      },
    });
  }

  async listAllowedWidgets(tenantId: string) {
    return this.prisma.console_widgets.findMany({
      where: { tenantId },
    });
  }
}
