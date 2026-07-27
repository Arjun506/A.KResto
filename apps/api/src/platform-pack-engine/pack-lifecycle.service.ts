import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  PackActivatedEvent,
  PackDisabledEvent,
  PackRollbackStartedEvent,
  PackUninstalledEvent,
} from '../event-bus/events/pack.events';

@Injectable()
export class PackLifecycleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async activatePack(id: string, tenantId: string) {
    const pack = await this.prisma.platform_packs.findUnique({ where: { id } });
    if (!pack) {
      throw new NotFoundException(`Pack ${id} not found`);
    }

    if (pack.status !== 'INSTALLED' && pack.status !== 'DISABLED') {
      throw new BadRequestException(
        `Cannot activate pack from state ${pack.status}`,
      );
    }

    const updated = await this.prisma.platform_packs.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    await this.prisma.platform_pack_installations.create({
      data: {
        packId: id,
        tenantId,
        status: 'ACTIVE',
      },
    });

    await this.eventBus.publish(
      new PackActivatedEvent(id, { packId: id, tenantId }),
    );

    return updated;
  }

  async disablePack(id: string, tenantId: string) {
    const pack = await this.prisma.platform_packs.findUnique({ where: { id } });
    if (!pack) {
      throw new NotFoundException(`Pack ${id} not found`);
    }

    if (pack.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot disable inactive pack');
    }

    const updated = await this.prisma.platform_packs.update({
      where: { id },
      data: { status: 'DISABLED' },
    });

    await this.prisma.platform_pack_installations.create({
      data: {
        packId: id,
        tenantId,
        status: 'DISABLED',
      },
    });

    await this.eventBus.publish(
      new PackDisabledEvent(id, { packId: id, tenantId }),
    );

    return updated;
  }

  async rollbackPack(id: string, fromVersion: string, targetVersion: string) {
    const pack = await this.prisma.platform_packs.findUnique({ where: { id } });
    if (!pack) {
      throw new NotFoundException(`Pack ${id} not found`);
    }

    await this.eventBus.publish(
      new PackRollbackStartedEvent(id, {
        packId: id,
        fromVersion,
        targetVersion,
      }),
    );

    // Revert status to installed state of prev version
    return this.prisma.platform_packs.update({
      where: { id },
      data: { status: 'INSTALLED' },
    });
  }

  async uninstallPack(id: string) {
    const pack = await this.prisma.platform_packs.findUnique({ where: { id } });
    if (!pack) {
      throw new NotFoundException(`Pack ${id} not found`);
    }

    await this.prisma.platform_packs.delete({ where: { id } });

    await this.eventBus.publish(
      new PackUninstalledEvent(id, { packId: id, code: pack.code }),
    );

    return { id, code: pack.code, status: 'DELETED' };
  }
}
