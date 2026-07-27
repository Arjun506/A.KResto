import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusModule } from '../event-bus/event-bus.module';
import { TenantModule } from '../tenant/tenant.module';
import { IamModule } from '../iam/iam.module';
import { PlatformPackModule } from '../platform-pack-engine/platform-pack.module';

import { SaasCommerceService } from './saas-commerce.service';
import { SaasCommerceController } from './saas-commerce.controller';

@Module({
  imports: [EventBusModule, TenantModule, IamModule, PlatformPackModule],
  controllers: [SaasCommerceController],
  providers: [PrismaService, SaasCommerceService],
  exports: [SaasCommerceService],
})
export class SaasCommerceModule {}
