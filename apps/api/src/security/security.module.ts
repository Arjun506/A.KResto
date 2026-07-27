import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KeyManagementService } from './key-management.service';
import { DataEncryptionService } from './data-encryption.service';
import { SecurityPolicyService } from './security-policy.service';
import { SecurityController } from './security.controller';

@Module({
  controllers: [SecurityController],
  providers: [
    PrismaService,
    KeyManagementService,
    DataEncryptionService,
    SecurityPolicyService,
  ],
  exports: [KeyManagementService, DataEncryptionService, SecurityPolicyService],
})
export class SecurityModule {}
