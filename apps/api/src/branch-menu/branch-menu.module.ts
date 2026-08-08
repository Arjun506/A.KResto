import { Module } from '@nestjs/common';
import { BranchMenuController } from './branch-menu.controller';
import { BranchMenuService } from './branch-menu.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BranchMenuController],
  providers: [BranchMenuService],
  exports: [BranchMenuService],
})
export class BranchMenuModule {}
