import { Injectable } from '@nestjs/common';
import { CapabilityRegistry } from './capability-registry';
import { CapabilityManifest } from './capability-manifest.types';

@Injectable()
export class CapabilitiesPlatformService {
  constructor(private readonly registry: CapabilityRegistry) {}

  listManifests(): CapabilityManifest[] {
    return this.registry.listAll();
  }

  // Foundation: expose navigation/widgets filtered by required permission.
  // Permission enforcement is stubbed for now (role -> boolean) because
  // the system-wide permission resolution is not wired into this milestone yet.
  // Later sprint will connect this to role/permission modules.
  getNavigationForRole(role: string) {
    const manif = this.listManifests();
    const items = manif.flatMap((m) => m.navigation.items);

    // Minimal stub: if role is 'admin' allow all, else require explicit permission
    // to be added later.
    if (role === 'admin') {
      return { groups: groupByCategory(items) };
    }

    const permitted = items.filter((it) => !it.requiredPermission);
    return { groups: groupByCategory(permitted) };
  }

  getWidgetsForRole(role: string) {
    const manif = this.listManifests();
    const widgets = manif.flatMap((m) => m.widgets);

    if (role === 'admin') return { widgets };
    const permitted = widgets.filter((w) => !w.requiredPermission);
    return { widgets: permitted };
  }
}

function groupByCategory(items: Array<{ category?: string }>) {
  const by = new Map<string, any[]>();
  for (const it of items) {
    const k = it.category ?? 'General';
    if (!by.has(k)) by.set(k, []);
    by.get(k)!.push(it);
  }
  return Array.from(by.entries()).map(([category, groupItems]) => ({
    label: category,
    items: groupItems,
  }));
}
