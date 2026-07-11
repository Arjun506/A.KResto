import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CloudService } from '../../src/cloud/cloud.service';
import { StorageAdapter } from '../../src/cloud/storage/storage.adapter';

describe('CloudService (unit)', () => {
  let service: CloudService;
  let mockStorage: jest.Mocked<StorageAdapter>;
  const registryPath = path.join(process.cwd(), 'uploads', 'metadata-registry.json');

  beforeEach(async () => {
    // Reset/cleanup metadata file if exists
    await fs.unlink(registryPath).catch(() => {});

    mockStorage = {
      save: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CloudService,
        {
          provide: 'StorageAdapter',
          useValue: mockStorage,
        },
      ],
    }).compile();

    service = moduleRef.get(CloudService);
  });

  afterAll(async () => {
    // Final cleanup of the generated test registry file
    await fs.unlink(registryPath).catch(() => {});
  });

  it('uploads a file correctly and saves it to the adapter and registry', async () => {
    mockStorage.save.mockResolvedValue('tenants/t1/logo/mock_logo.png');

    const file = {
      buffer: Buffer.from('mock_file_data'),
      originalname: 'logo.png',
      mimetype: 'image/png',
      size: 1024,
    };

    const result = await service.uploadFile('t1', 'u1', file, 'logo', true);

    expect(mockStorage.save).toHaveBeenCalledTimes(1);
    expect(result.tenantId).toBe('t1');
    expect(result.originalName).toBe('logo.png');
    expect(result.isPublic).toBe(true);
    expect(result.url).toContain('/api/v1/cloud/public/tenants/t1/logo/');
  });

  it('lists files filtered by tenant and category', async () => {
    mockStorage.save.mockResolvedValue('key');
    const file = {
      buffer: Buffer.from('data'),
      originalname: 'invoice.pdf',
      mimetype: 'application/pdf',
      size: 500,
    };

    await service.uploadFile('t1', 'u1', file, 'invoice', false);
    await service.uploadFile('t2', 'u1', file, 'invoice', false); // different tenant
    await service.uploadFile('t1', 'u1', file, 'backup', false); // different category

    const allT1 = await service.listFiles('t1');
    expect(allT1).toHaveLength(2);

    const invoicesT1 = await service.listFiles('t1', 'invoice');
    expect(invoicesT1).toHaveLength(1);
    expect(invoicesT1[0].category).toBe('invoice');
  });

  it('throws NotFoundException when file metadata is missing or scopes conflict', async () => {
    await expect(service.getFileMetadata('t1', 'nonexistent_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deletes file asset from disk and metadata index logs', async () => {
    mockStorage.save.mockResolvedValue('tenants/t1/backup/b1.zip');
    mockStorage.delete.mockResolvedValue();

    const file = {
      buffer: Buffer.from('data'),
      originalname: 'b1.zip',
      mimetype: 'application/zip',
      size: 2000,
    };

    const uploaded = await service.uploadFile('t1', 'u1', file, 'backup', false);

    await service.deleteFile('t1', uploaded.id);

    expect(mockStorage.delete).toHaveBeenCalledWith(uploaded.fileName);
    await expect(service.getFileMetadata('t1', uploaded.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
