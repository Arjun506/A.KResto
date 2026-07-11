import { Injectable } from '@nestjs/common';
import { CapabilityManifest } from './capability-manifest.types';
import { productCapabilityManifest } from '../product-capability/product-capability-manifest';

@Injectable()
export class CapabilityRegistry {
  private readonly capabilitiesById = new Map<string, CapabilityManifest>();

  constructor() {
    // Minimal placeholder capabilities to keep the platform end-to-end functional.
    const bootstrap: CapabilityManifest[] = [
      {
        capabilityId: 'capability-core',
        capabilityName: 'Core Capability Foundation',
        version: '1.0.0',
        description:
          'Non-business placeholder used to validate the Capability Platform wiring.',
        permissions: {
          actions: [
            {
              action: 'capability:read',
              description: 'Read capability manifests',
            },
          ],
        },
        routes: [{ path: '/capabilities-platform', method: 'GET' }],
        widgets: [
          {
            id: 'capability-foundation-widget',
            widgetKey: 'capability-foundation-widget',
            name: 'Capability Foundation Widget',
            category: 'Foundation',
            requiredPermission: 'capability:read',
          },
        ],
        navigation: {
          items: [
            {
              id: 'capability-foundation',
              name: 'Capabilities',
              href: '/dashboard/capabilities',
              iconKey: 'Layers',
              category: 'General',
              requiredPermission: 'capability:read',
            },
          ],
        },
        settings: {},
        api: {
          version: '1',
          basePath: '/api/v1/capabilities-platform',
          endpoints: [
            {
              path: '/manifest',
              method: 'GET',
              description: 'Get all capability manifests',
            },
          ],
        },
        events: {
          topics: [
            {
              key: 'capability.activated',
              direction: 'EMIT',
              description:
                'Emitted when a capability is activated for a tenant',
            },
          ],
        },
        configuration: {
          schema: {},
        },
        dependencies: [],
        industryCompatibility: ['*'],
        licenseStatus: 'OPEN_SOURCE',
      },
      productCapabilityManifest,
    ];

    for (const c of bootstrap) {
      this.capabilitiesById.set(c.capabilityId, c);
    }
  }

  listAll(): CapabilityManifest[] {
    return Array.from(this.capabilitiesById.values());
  }

  get(capabilityId: string): CapabilityManifest {
    const c = this.capabilitiesById.get(capabilityId);

    if (!c) throw new Error(`Unknown capabilityId: ${capabilityId}`);
    return c;
  }
}
