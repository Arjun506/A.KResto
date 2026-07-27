import { Test, TestingModule } from '@nestjs/testing';
import { KeyManagementService } from './key-management.service';
import { DataEncryptionService } from './data-encryption.service';
import {
  SecurityPolicyService,
  SensitiveClassification,
} from './security-policy.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

describe('DataSecurityService', () => {
  let kms: KeyManagementService;
  let encryption: DataEncryptionService;
  let policy: SecurityPolicyService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      security_key_metadata: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      security_access_events: {
        create: jest.fn(),
      },
      hc_emrs: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyManagementService,
        DataEncryptionService,
        SecurityPolicyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    kms = module.get<KeyManagementService>(KeyManagementService);
    encryption = module.get<DataEncryptionService>(DataEncryptionService);
    policy = module.get<SecurityPolicyService>(SecurityPolicyService);
  });

  it('should encrypt and decrypt fields matching AES-256-GCM configurations', async () => {
    // Mock getOrCreateTenantDek returns active key
    prisma.security_key_metadata.findFirst.mockResolvedValue({
      keyId: 'key_1',
      wrappedDek: Buffer.from('wrapped-value-mock').toString('base64'),
      keyVersion: 1,
      tenantId: 't_1',
    });
    prisma.security_key_metadata.findUnique.mockResolvedValue({
      keyId: 'key_1',
      wrappedDek: Buffer.from('wrapped-value-mock').toString('base64'),
      keyVersion: 1,
      tenantId: 't_1',
    });

    // Mock KMS wrap/unwrap methods
    const rawDek = crypto.randomBytes(32);
    jest
      .spyOn(kms, 'getOrCreateTenantDek')
      .mockResolvedValue({ dek: rawDek, keyId: 'key_1', version: 1 });
    jest.spyOn(kms, 'retrieveDekByVersion').mockResolvedValue(rawDek);

    const plaintext = 'Secret Patient Notes';
    const ciphertext = await encryption.encryptField('t_1', plaintext);
    const decrypted = await encryption.decryptField('t_1', ciphertext, {
      userId: 'u_1',
      resourceType: 'HC_EMR',
    });

    expect(decrypted).toEqual(plaintext);
    expect(prisma.security_access_events.create).toHaveBeenCalled();
  });

  it('should enforce tenant boundary isolation and block cross-tenant decryption', async () => {
    prisma.security_key_metadata.findFirst.mockResolvedValue({
      keyId: 'key_1',
      wrappedDek: Buffer.from('wrapped-value-mock').toString('base64'),
      keyVersion: 1,
      tenantId: 't_1',
    });
    // Decrypt request comes from t_2 context
    prisma.security_key_metadata.findUnique.mockResolvedValue({
      keyId: 'key_1',
      wrappedDek: Buffer.from('wrapped-value-mock').toString('base64'),
      keyVersion: 1,
      tenantId: 't_1', // key belongs to t_1
    });

    const rawDek = crypto.randomBytes(32);
    jest
      .spyOn(kms, 'getOrCreateTenantDek')
      .mockResolvedValue({ dek: rawDek, keyId: 'key_1', version: 1 });
    jest.spyOn(kms, 'retrieveDekByVersion').mockResolvedValue(rawDek);

    const ciphertext = await encryption.encryptField('t_1', 'Patient record');

    // Attempting decrypt with t_2 tenant context should fail
    await expect(
      encryption.decryptField('t_2', ciphertext, {
        userId: 'u_1',
        resourceType: 'HC_EMR',
      }),
    ).rejects.toThrow(
      'Cryptographic boundary violation: Key tenant context mismatch',
    );
  });

  it('should generate secure blind indexes matching normalization rules', () => {
    const raw = ' DL-1C A-1234 '; // vehicle license plate
    const hash = encryption.generateBlindIndex(raw);
    const expectedHash = crypto
      .createHmac(
        'sha256',
        crypto
          .createHash('sha256')
          .update('dev-local-blind-index-key-secret!')
          .digest(),
      )
      .update('dl-1ca-1234')
      .digest('hex');

    expect(hash).toEqual(expectedHash);
  });
});
