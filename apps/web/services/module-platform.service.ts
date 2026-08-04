import api from './api';
import { unwrap } from './helpers';
import type {
  ModuleSidebarResponse,
  ModuleWidgetsResponse,
} from '../types/module-platform.types';

async function getTenantId(): Promise<string> {
  const v = localStorage.getItem('tenantId');
  if (!v) throw new Error('Missing tenantId (tenantId)');
  return v;
}

export async function installModule(moduleId: string, version?: string) {
  const tenantId = await getTenantId();
  return unwrap<any>(
    api.post(
      `/module-platform/${encodeURIComponent(moduleId)}/install?tenantId=${encodeURIComponent(tenantId)}`,
      { version },
    ),
  );
}

export async function getSidebarItems(role: string) {
  const tenantId = await getTenantId();
  return unwrap<ModuleSidebarResponse>(
    api.get(
      `/module-platform/sidebar?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`,
    ),
  );
}

export async function getDashboardWidgets(role: string) {
  const tenantId = await getTenantId();
  return unwrap<ModuleWidgetsResponse>(
    api.get(
      `/module-platform/widgets?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`,
    ),
  );
}


