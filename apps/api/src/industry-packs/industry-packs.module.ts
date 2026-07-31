import { Module } from '@nestjs/common';

import { IndustryPackRegistry } from './industry-pack.registry';
import { IndustryPacksController } from './industry-packs.controller';
import { IndustryPacksService } from './industry-packs.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [IndustryPacksController],
  providers: [IndustryPackRegistry, IndustryPacksService],
  exports: [IndustryPacksService],
})
export class IndustryPacksModule {}
