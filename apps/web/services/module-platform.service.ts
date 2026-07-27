import type {
  ModuleSidebarResponse,
  ModuleWidgetsResponse,
} from '../types/module-platform.types';

async function getTenantId(): Promise<string> {
  // Tenant is represented as tenantId in JWT.
  // Current frontend does not reliably expose it via a single selector,
  // so we default to the value stored in localStorage by other flows.
  // This will be wired properly in Sprint 2 continuation.
  const v = localStorage.getItem('tenantId');
  if (!v) throw new Error('Missing tenantId (tenantId)');
  return v;
}

export async function installModule(moduleId: string, version?: string) {
  const tenantId = await getTenantId();
  const res = await fetch(
    `/api/v1/module-platform/${encodeURIComponent(moduleId)}/install?tenantId=${encodeURIComponent(tenantId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to install module ${moduleId}`);
  }

  return res.json();
}

export async function getSidebarItems(role: string) {
  const tenantId = await getTenantId();
  const res = await fetch(
    `/api/v1/module-platform/sidebar?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`,
    { method: 'GET' },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ModuleSidebarResponse;
}

export async function getDashboardWidgets(role: string) {
  const tenantId = await getTenantId();
  const res = await fetch(
    `/api/v1/module-platform/widgets?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`,
    { method: 'GET' },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as ModuleWidgetsResponse;
}


