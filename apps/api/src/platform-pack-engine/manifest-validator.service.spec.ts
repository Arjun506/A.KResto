import { Test, TestingModule } from '@nestjs/testing';
import {
  ManifestValidatorService,
  PackManifest,
} from './manifest-validator.service';

describe('ManifestValidatorService', () => {
  let service: ManifestValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManifestValidatorService],
    }).compile();

    service = module.get<ManifestValidatorService>(ManifestValidatorService);
  });

  it('should validate complete and correct SemVer manifest files', async () => {
    const manifest: PackManifest = {
      name: 'Restaurant Pack',
      code: 'rest-pack',
      version: '1.2.0',
    };

    const result = await service.validateManifest(manifest);
    expect(result).toBe(true);
  });

  it('should reject manifest files with incorrect version strings', async () => {
    const manifest: PackManifest = {
      name: 'Restaurant Pack',
      code: 'rest-pack',
      version: '1.2-alpha',
    };

    await expect(service.validateManifest(manifest)).rejects.toThrow();
  });
});
