import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
