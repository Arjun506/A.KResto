import { Module } from '@nestjs/common';

import { ModulePlatformController } from './module-platform.controller';
import { ModulePlatformService } from './module-platform.service';
import { ModuleRegistry } from './registry/module-registry';
import { DependencyResolver } from './resolver/dependency-resolver';
import { ModuleStateService } from './state/module-state.service';
import { ModulePermissionService } from './permissions/module-permission.service';
import { ModuleProvisioner } from './provisioner/module-provisioner';

@Module({
  controllers: [ModulePlatformController],
  providers: [
    ModulePlatformService,
    ModuleRegistry,
    DependencyResolver,
    ModuleStateService,
    ModulePermissionService,
    ModuleProvisioner,
  ],
  exports: [ModuleProvisioner],
})
export class ModulePlatformModule {}
