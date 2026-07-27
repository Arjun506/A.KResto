import { SidebarItem, UserRole } from '@business-os/types';

export interface IndustryPackManifest {
  id: string;
  name: string;
  version: string;
  industry: string;
  modules: string[];
  permissions: string[];
  widgets?: Array<{
    key: string;
    component: string;
    defaultGrid: { w: number; h: number };
  }>;
}

export interface IndustryPackDefinition {
  id: string;
  industry: string;
  onInstall: (tenantId: string) => Promise<boolean>;
  onUninstall?: (tenantId: string) => Promise<boolean>;
  onEnable?: (tenantId: string) => Promise<boolean>;
  onDisable?: (tenantId: string) => Promise<boolean>;
}

export class IndustryPackRegistry {
  private static instance: IndustryPackRegistry;
  private packs = new Map<string, IndustryPackDefinition>();
  private sidebarRegistry = new Map<string, SidebarItem[]>();

  private constructor() {}

  public static getInstance(): IndustryPackRegistry {
    if (!IndustryPackRegistry.instance) {
      IndustryPackRegistry.instance = new IndustryPackRegistry();
    }
    return IndustryPackRegistry.instance;
  }

  public registerPack(def: IndustryPackDefinition) {
    this.packs.set(def.id, def);
  }

  public getPack(id: string): IndustryPackDefinition | undefined {
    return this.packs.get(id);
  }

  public registerSidebar(industry: string, items: SidebarItem[]) {
    this.sidebarRegistry.set(industry, items);
  }

  public getSidebar(industry: string): SidebarItem[] {
    return this.sidebarRegistry.get(industry) || [];
  }
}
