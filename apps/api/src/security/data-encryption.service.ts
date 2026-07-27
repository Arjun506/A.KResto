import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KeyManagementService } from './key-management.service';
import * as crypto from 'crypto';

export interface EncryptedPayload {
  ciphertext: string;
  nonce: string;
  tag: string;
  keyId: string;
  keyVersion: number;
  algorithm: string;
}

@Injectable()
export class DataEncryptionService {
  private readonly blindIndexSecret: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kms: KeyManagementService,
  ) {
    const rawIndexSecret =
      process.env.SAAS_BLIND_INDEX_KEY || 'dev-local-blind-index-key-secret!';
    this.blindIndexSecret = crypto
      .createHash('sha256')
      .update(rawIndexSecret)
      .digest();
  }

  // 1. Field-Level AES-256-GCM Encryption
  async encryptField(tenantId: string, plaintext: string): Promise<string> {
    const { dek, keyId, version } =
      await this.kms.getOrCreateTenantDek(tenantId);

    const iv = crypto.randomBytes(12); // Cryptographically secure random nonce
    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);

    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    const payload: EncryptedPayload = {
      ciphertext: encrypted.toString('base64'),
      nonce: iv.toString('base64'),
      tag: tag.toString('base64'),
      keyId,
      keyVersion: version,
      algorithm: 'AES-256-GCM',
    };

    return JSON.stringify(payload);
  }

  // 2. Controlled Field-Level Decryption with Auditing
  async decryptField(
    tenantId: string,
    encryptedJsonStr: string,
    auditContext: {
      userId?: string;
      resourceType: string;
      resourceId?: string;
      purpose?: string;
    },
  ): Promise<string> {
    let payload: EncryptedPayload;
    try {
      payload = JSON.parse(encryptedJsonStr);
      if (
        !payload ||
        !payload.ciphertext ||
        !payload.nonce ||
        !payload.tag ||
        !payload.keyId
      ) {
        return encryptedJsonStr;
      }
    } catch (e) {
      // It is not stringified JSON, so treat it as plaintext fallback
      return encryptedJsonStr;
    }

    // Cryptographic Tenant Isolation: Verify key belongs to the requesting tenant context
    const keyRecord = await this.prisma.security_key_metadata.findUnique({
      where: { keyId: payload.keyId },
    });
    if (
      !keyRecord ||
      (keyRecord.tenantId !== tenantId && keyRecord.tenantId !== 'GLOBAL')
    ) {
      throw new BadRequestException(
        'Cryptographic boundary violation: Key tenant context mismatch',
      );
    }

    const dek = await this.kms.retrieveDekByVersion(payload.keyId);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      dek,
      Buffer.from(payload.nonce, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]);

    // Write decryption to immutable access audit ledger
    await this.prisma.security_access_events.create({
      data: {
        tenantId,
        userId: auditContext.userId || null,
        resourceType: auditContext.resourceType,
        resourceId: auditContext.resourceId || null,
        action: 'security.data.decrypted',
        purpose: auditContext.purpose || 'DATA_READ',
      },
    });

    return decrypted.toString('utf8');
  }

  // 3. Blind Indexes (HMAC-SHA-256 with normalized values)
  generateBlindIndex(plaintext: string): string {
    // Normalization rule: lowercase and strip spaces
    const normalized = plaintext.toLowerCase().replace(/\s+/g, '');
    return crypto
      .createHmac('sha256', this.blindIndexSecret)
      .update(normalized)
      .digest('hex');
  }
}
