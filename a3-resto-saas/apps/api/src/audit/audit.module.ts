import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Audit logging module
 * Tracks all data mutations for compliance and auditing
 */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AuditModule {}
