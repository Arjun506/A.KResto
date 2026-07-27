import api from './api';

export interface ModuleRequirement {
  planTier: string;
  required: boolean;
}

export interface ModuleDefinition {
  moduleId: string;
  moduleName: string;
  version: string;
  description: string;
  category: string;
  dependencies: Array<{ moduleId: string; minVersion?: string }>;
  industryCompatibility: string[];
  permissions: {
    actions: string[];
  };
  licenseStatus: 'OPEN_SOURCE' | 'COMMERCIAL' | 'PROPRIETARY';
  subscriptionRequirements: ModuleRequirement[];
  settings?: Record<string, any>;
}

export interface InstalledModuleState {
  moduleId: string;
  version: string;
  isEnabled: boolean;
  config?: any;
}

export async function getModulesCatalog(): Promise<ModuleDefinition[]> {
  const res = await api.get('/module-platform/registry');
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function getInstalledModules(tenantId: string): Promise<InstalledModuleState[]> {
  const res = await api.get(`/module-platform/installed?tenantId=${tenantId}`);
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function installModule(
  moduleId: string,
  tenantId: string,
  version?: string,
  config?: any,
): Promise<{ ok: boolean }> {
  const res = await api.post(`/module-platform/${moduleId}/install?tenantId=${tenantId}`, {
    version,
    config,
  });
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function uninstallModule(moduleId: string, tenantId: string): Promise<{ ok: boolean }> {
  const res = await api.post(`/module-platform/${moduleId}/uninstall?tenantId=${tenantId}`);
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function enableModule(moduleId: string, tenantId: string): Promise<{ ok: boolean; enabled: boolean }> {
  const res = await api.post(`/module-platform/${moduleId}/enable?tenantId=${tenantId}`);
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function disableModule(moduleId: string, tenantId: string): Promise<{ ok: boolean; enabled: boolean }> {
  const res = await api.post(`/module-platform/${moduleId}/disable?tenantId=${tenantId}`);
  if (res.data.success) return res.data.data;
  return res.data;
}

export async function updateModule(
  moduleId: string,
  tenantId: string,
  version: string,
  config?: any,
): Promise<{ ok: boolean; version: string }> {
  const res = await api.post(`/module-platform/${moduleId}/update?tenantId=${tenantId}`, {
    version,
    config,
  });
  if (res.data.success) return res.data.data;
  return res.data;
}

