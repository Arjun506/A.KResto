import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { CommandExecutedEvent } from '../event-bus/events/console.events';

@Injectable()
export class ConsoleCommandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async registerCommand(
    triggerPhrase: string,
    actionEndpoint: string,
    packId?: string,
  ) {
    return this.prisma.console_commands.create({
      data: {
        triggerPhrase,
        actionEndpoint,
        packId,
      },
    });
  }

  async executeCommand(
    tenantId: string,
    userId: string,
    triggerPhrase: string,
  ) {
    const command = await this.prisma.console_commands.findFirst({
      where: {
        triggerPhrase: { contains: triggerPhrase, mode: 'insensitive' },
      },
    });

    await this.eventBus.publish(
      new CommandExecutedEvent(userId, { triggerPhrase, userId }, tenantId),
    );

    return {
      executed: !!command,
      triggerPhrase,
      actionEndpoint: command?.actionEndpoint || null,
      message: command
        ? 'Action routed successfully'
        : 'Command execution fallback executed',
    };
  }

  async listCommands() {
    return this.prisma.console_commands.findMany();
  }
}
