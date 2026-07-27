import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { KeyManagementService } from './key-management.service';
import { DataEncryptionService } from './data-encryption.service';
import {
  SecurityPolicyService,
  SensitiveClassification,
} from './security-policy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StepUpAuthGuard } from './step-up-auth.guard';
import * as crypto from 'crypto';

@ApiTags('Zero-Trust Security Platform — Operations')
@Controller('security')
export class SecurityController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kms: KeyManagementService,
    private readonly encryption: DataEncryptionService,
    private readonly policy: SecurityPolicyService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('mfa/challenge')
  @ApiOperation({ summary: 'Issue a step-up verification challenge' })
  async createChallenge(@Req() req: any, @Body() body: { purpose: string }) {
    const user = req.user;
    const challengeId = crypto.randomUUID();
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP
    const hash = crypto.createHash('sha256').update(otp).digest('hex');

    await this.prisma.security_mfa_challenges.create({
      data: {
        userId: user.id,
        challengeId,
        codeHash: hash,
        purpose: body.purpose,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      },
    });

    // In local development, we return OTP in payload to simplify integration testing
    return {
      challengeId,
      purpose: body.purpose,
      devOtp: otp,
      message: 'verification challenge created',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  @ApiOperation({ summary: 'Verify a step-up verification challenge code' })
  async verifyChallenge(
    @Req() req: any,
    @Body() body: { challengeId: string; code: string },
  ) {
    const user = req.user;
    const challenge = await this.prisma.security_mfa_challenges.findUnique({
      where: { challengeId: body.challengeId },
    });

    if (!challenge || challenge.userId !== user.id) {
      throw new BadRequestException('MFA challenge not found');
    }

    if (challenge.expiresAt < new Date()) {
      throw new BadRequestException('MFA challenge expired');
    }

    if (challenge.attempts >= 3) {
      throw new BadRequestException('Maximum verification attempts exceeded');
    }

    const codeHash = crypto
      .createHash('sha256')
      .update(body.code)
      .digest('hex');
    if (challenge.codeHash !== codeHash) {
      await this.prisma.security_mfa_challenges.update({
        where: { id: challenge.id },
        data: { attempts: challenge.attempts + 1 },
      });
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.security_mfa_challenges.update({
      where: { id: challenge.id },
      data: { verifiedAt: new Date() },
    });

    return {
      stepUpToken: challenge.challengeId,
      status: 'VERIFIED',
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(StepUpAuthGuard)
  @Post('keys/rotate')
  @ApiOperation({
    summary: 'Rotate data encryption keys (Requires step-up MFA)',
  })
  async rotateKeys(@Req() req: any) {
    const tenantId = req.user.tenantId || 'GLOBAL';
    return this.kms.rotateTenantDek(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('migration/encrypt')
  @ApiOperation({ summary: 'Trigger plaintext records migration runner' })
  async triggerMigration(@Req() req: any) {
    const tenantId = req.user.tenantId || 'GLOBAL';

    // Fetch EMR records to migrate plaintext -> encrypted
    const emrs = await this.prisma.hc_emrs.findMany();
    let migratedCount = 0;

    for (const emr of emrs) {
      // If it doesn't look like ciphertext format, encrypt it
      if (
        !emr.clinicalNotes.startsWith('{') ||
        !emr.clinicalNotes.includes('ciphertext')
      ) {
        const encrypted = await this.encryption.encryptField(
          tenantId,
          emr.clinicalNotes,
        );
        await this.prisma.hc_emrs.update({
          where: { id: emr.id },
          data: { clinicalNotes: encrypted },
        });
        migratedCount++;
      }
    }

    return {
      status: 'COMPLETED',
      migratedCount,
    };
  }
}
