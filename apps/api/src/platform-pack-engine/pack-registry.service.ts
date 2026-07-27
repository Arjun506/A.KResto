import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../event-bus/event-bus.service';
import {
  PackUploadedEvent,
  PackInstalledEvent,
} from '../event-bus/events/pack.events';

@Injectable()
export class PackRegistryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  async uploadPack(code: string, name: string, licenseKey?: string) {
    const existing = await this.prisma.platform_packs.findUnique({
      where: { code },
    });
    if (existing) {
      throw new ConflictException(`Pack with code ${code} already uploaded`);
    }

    const pack = await this.prisma.platform_packs.create({
      data: {
        code,
        name,
        licenseKey,
        status: 'DRAFT',
      },
    });

    await this.eventBus.publish(
      new PackUploadedEvent(pack.id, { packId: pack.id, code: pack.code }),
    );

    return pack;
  }

  async installPackVersion(
    packId: string,
    version: string,
    changelogJson?: any,
  ) {
    const pack = await this.prisma.platform_packs.findUnique({
      where: { id: packId },
    });
    if (!pack) {
      throw new NotFoundException(`Pack ${packId} not found`);
    }

    const ver = await this.prisma.platform_pack_versions.create({
      data: {
        packId,
        semverString: version,
        changelogJson,
      },
    });

    await this.prisma.platform_packs.update({
      where: { id: packId },
      data: { status: 'INSTALLED' },
    });

    await this.eventBus.publish(
      new PackInstalledEvent(packId, { packId, code: pack.code, version }),
    );

    return ver;
  }

  async getPack(id: string) {
    return this.prisma.platform_packs.findUnique({
      where: { id },
      include: { versions: true, dependencies: true, health: true },
    });
  }

  async listPacks() {
    return this.prisma.platform_packs.findMany({
      include: { versions: true },
    });
  }
}
