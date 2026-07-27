import { Global, Module } from '@nestjs/common';
import { PlatformSettingsService } from './platform-settings.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [PlatformSettingsService, PrismaService],
  exports: [PlatformSettingsService],
})
export class PlatformSettingsModule {}
