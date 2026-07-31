import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PosRegisterController } from './pos-register.controller';
import { PosRegisterService } from './pos-register.service';

@Module({
  controllers: [PosRegisterController],
  providers: [PosRegisterService],
  exports: [PosRegisterService],
})
export class PosRegisterModule {}
