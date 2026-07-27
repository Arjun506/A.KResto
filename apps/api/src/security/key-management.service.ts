import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// Provider abstraction: Dev fallback or Cloud KMS custody
export interface KeyManagementProvider {
  wrapKey(plaintextDek: Buffer): Promise<Buffer>;
  unwrapKey(wrappedDek: Buffer): Promise<Buffer>;
}

@Injectable()
export class KeyManagementService implements KeyManagementProvider {
  // Production MEK is kept separately in environment / KMS. Raw master keys must never be committed or hardcoded.
  private readonly masterKey: Buffer;

  constructor(private readonly prisma: PrismaService) {
    const rawSecret =
      process.env.SAAS_MASTER_ENCRYPTION_KEY ||
      'dev-local-master-key-32-bytes-long!';
    this.masterKey = crypto.createHash('sha256').update(rawSecret).digest();
  }

  // KMS Provider wraps/unwraps DEKs using the Master Key (MEK)
  async wrapKey(plaintextDek: Buffer): Promise<Buffer> {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintextDek),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]);
  }

  async unwrapKey(wrappedDek: Buffer): Promise<Buffer> {
    const iv = wrappedDek.subarray(0, 12);
    const tag = wrappedDek.subarray(12, 28);
    const encrypted = wrappedDek.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  }

  // Tenant-aware DEK retrieval & rotation
  async getOrCreateTenantDek(
    tenantId: string,
  ): Promise<{ dek: Buffer; keyId: string; version: number }> {
    let keyRecord = await this.prisma.security_key_metadata.findFirst({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { keyVersion: 'desc' },
    });

    if (!keyRecord) {
      // Generate a new cryptographically secure 32-byte DEK
      const rawDek = crypto.randomBytes(32);
      const wrapped = await this.wrapKey(rawDek);

      keyRecord = await this.prisma.security_key_metadata.create({
        data: {
          tenantId,
          keyId: crypto.randomUUID(),
          wrappedDek: wrapped.toString('base64'),
          keyVersion: 1,
          algorithm: 'AES-256-GCM',
          status: 'ACTIVE',
        },
      });
      return {
        dek: rawDek,
        keyId: keyRecord.keyId,
        version: keyRecord.keyVersion,
      };
    }

    const unwrapped = await this.unwrapKey(
      Buffer.from(keyRecord.wrappedDek, 'base64'),
    );
    return {
      dek: unwrapped,
      keyId: keyRecord.keyId,
      version: keyRecord.keyVersion,
    };
  }

  async rotateTenantDek(
    tenantId: string,
  ): Promise<{ newKeyId: string; newVersion: number }> {
    const currentKey = await this.prisma.security_key_metadata.findFirst({
      where: { tenantId, status: 'ACTIVE' },
      orderBy: { keyVersion: 'desc' },
    });

    const nextVersion = currentKey ? currentKey.keyVersion + 1 : 1;

    // Revoke old key state (old ciphertext remains readable via old version lookups)
    if (currentKey) {
      await this.prisma.security_key_metadata.update({
        where: { id: currentKey.id },
        data: { status: 'DEPRECATED' },
      });
    }

    const rawDek = crypto.randomBytes(32);
    const wrapped = await this.wrapKey(rawDek);

    const newKey = await this.prisma.security_key_metadata.create({
      data: {
        tenantId,
        keyId: crypto.randomUUID(),
        wrappedDek: wrapped.toString('base64'),
        keyVersion: nextVersion,
        algorithm: 'AES-256-GCM',
        status: 'ACTIVE',
      },
    });

    return {
      newKeyId: newKey.keyId,
      newVersion: newKey.keyVersion,
    };
  }

  async retrieveDekByVersion(keyId: string): Promise<Buffer> {
    const record = await this.prisma.security_key_metadata.findUnique({
      where: { keyId },
    });
    if (!record) {
      throw new NotFoundException(`Cryptographic key ${keyId} not found`);
    }
    return this.unwrapKey(Buffer.from(record.wrappedDek, 'base64'));
  }
}
