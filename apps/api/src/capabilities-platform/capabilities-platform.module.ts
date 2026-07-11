import { Module } from '@nestjs/common';
import { CapabilityRegistry } from './capability-registry';
import { CapabilitiesPlatformController } from './capabilities-platform.controller';
import { CapabilitiesPlatformService } from './capabilities-platform.service';

@Module({
  controllers: [CapabilitiesPlatformController],
  providers: [CapabilityRegistry, CapabilitiesPlatformService],
  exports: [CapabilityRegistry],
})
export class CapabilitiesPlatformModule {}
