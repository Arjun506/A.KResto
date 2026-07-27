import { Test, TestingModule } from '@nestjs/testing';
import { FilePlatformService } from './file-platform.service';
import { LocalStorageDriver } from './drivers/local-storage.driver';

describe('FilePlatformService', () => {
  let service: FilePlatformService;
  let driver: Partial<LocalStorageDriver>;

  beforeEach(async () => {
    driver = {
      upload: jest.fn().mockResolvedValue({
        key: 'docs/test.pdf',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        url: '/uploads/docs/test.pdf',
      }),
      getSignedUrl: jest
        .fn()
        .mockResolvedValue('/uploads/docs/test.pdf?expires=123'),
      delete: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilePlatformService,
        { provide: LocalStorageDriver, useValue: driver },
      ],
    }).compile();

    service = module.get<FilePlatformService>(FilePlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate upload to storage driver', async () => {
    const file: any = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from(''),
    };
    const descriptor = await service.uploadFile(file, 'docs');
    expect(descriptor.key).toBe('docs/test.pdf');
    expect(driver.upload).toHaveBeenCalled();
  });
});
