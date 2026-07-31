import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JsonLogger } from '../common/logger/json-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new JsonLogger();

  async onModuleInit() {
    this.logger.log(
      'BOOTSTRAP_STAGE_03_PRISMA_CONNECTING - Prisma connecting to database...',
    );
    await this.$connect();
    this.logger.log(
      'BOOTSTRAP_STAGE_03_PRISMA_READY - Prisma connected successfully.',
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
