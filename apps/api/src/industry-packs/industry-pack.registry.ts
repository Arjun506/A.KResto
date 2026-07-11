import { Injectable } from '@nestjs/common';

export type IndustryPackModuleDef = {
  moduleId: string;
};

export type IndustryPackSidebarDef = Record<string, unknown>;
export type IndustryPackWidgetDef = Record<string, unknown>;
export type IndustryPackPermissionDef = Record<string, unknown>;

export type IndustryPackDefinition = {
  industryKey: string;
  packName: string;
  description: string;

  modules: IndustryPackModuleDef[];
  sidebar: IndustryPackSidebarDef;
  widgets: IndustryPackWidgetDef;
  permissions: IndustryPackPermissionDef;

  // Feature flags could be added later.
};

@Injectable()
export class IndustryPackRegistry {
  // Note: For this milestone we only scaffold the engine.
  // No restaurant-specific pack metadata is introduced yet.
  private readonly packs = new Map<string, IndustryPackDefinition>();

  constructor() {
    // Intentionally empty for now.
  }

  registerPack(def: IndustryPackDefinition) {
    this.packs.set(def.industryKey, def);
  }

  getPack(industryKey: string): IndustryPackDefinition {
    const pack = this.packs.get(industryKey);
    if (!pack) throw new Error(`Unknown industry pack: ${industryKey}`);
    return pack;
  }

  listAll(): IndustryPackDefinition[] {
    return Array.from(this.packs.values());
  }
}
