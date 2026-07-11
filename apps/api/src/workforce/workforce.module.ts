import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkforceController } from './workforce.controller';
import { WorkforceService } from './workforce.service';

@Module({
  controllers: [WorkforceController],
  providers: [WorkforceService, PrismaService],
  exports: [WorkforceService],
})
export class WorkforceModule {}
