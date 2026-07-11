import { Injectable } from '@nestjs/common';

import { IndustryPackRegistry } from './industry-pack.registry';

@Injectable()
export class IndustryPacksService {
  constructor(private readonly registry: IndustryPackRegistry) {}

  listInstalledPacks(_tenantId: string) {
    return { packs: [] };
  }

  getDerivedSidebar(_input: { tenantId: string; role: string }) {
    return { groups: [] };
  }

  getDerivedWidgets(_input: { tenantId: string; role: string }) {
    return { widgets: [] };
  }
}
