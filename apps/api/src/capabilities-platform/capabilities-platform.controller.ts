import { Controller, Get, Query } from '@nestjs/common';
import { CapabilitiesPlatformService } from './capabilities-platform.service';
import { CapabilityRegistry } from './capability-registry';

@Controller('capabilities-platform')
export class CapabilitiesPlatformController {
  constructor(
    private readonly service: CapabilitiesPlatformService,
    private readonly registry: CapabilityRegistry,
  ) {}

  @Get('manifest')
  listManifests() {
    return { capabilities: this.service.listManifests() };
  }

  @Get('navigation')
  navigation(@Query('role') role: string) {
    return this.service.getNavigationForRole(role);
  }

  @Get('widgets')
  widgets(@Query('role') role: string) {
    return this.service.getWidgetsForRole(role);
  }

  // Convenience endpoint for debugging/foundation wiring.
  @Get('health')
  health() {
    // ensures registry is reachable
    this.registry.listAll();
    return { ok: true };
  }
}
