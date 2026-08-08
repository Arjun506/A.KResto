import { Module } from '@nestjs/common';
import { BranchInventoryController } from './branch-inventory.controller';
import { BranchInventoryService } from './branch-inventory.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventBusModule } from '../event-bus/event-bus.module';

@Module({
  imports: [PrismaModule, EventBusModule],
  controllers: [BranchInventoryController],
  providers: [BranchInventoryService],
  exports: [BranchInventoryService],
})
export class BranchInventoryModule {}
