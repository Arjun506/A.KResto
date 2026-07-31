import { Module } from '@nestjs/common';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';
import { IamRepository } from './iam.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [IamController],
  providers: [IamService, IamRepository],
  exports: [IamService, IamRepository],
})
export class IamModule {}
