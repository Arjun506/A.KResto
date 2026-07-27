import { Injectable, BadRequestException } from '@nestjs/common';

export interface PackManifest {
  name: string;
  code: string;
  version: string;
  dependencies?: Record<string, string>;
  permissions?: { role: string; scope: string }[];
  routes?: { method: string; path: string }[];
}

@Injectable()
export class ManifestValidatorService {
  async validateManifest(manifest: PackManifest): Promise<boolean> {
    if (!manifest.name || !manifest.code || !manifest.version) {
      throw new BadRequestException(
        'Manifest missing name, code, or version attributes',
      );
    }

    // SemVer validation check regex
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(manifest.version)) {
      throw new BadRequestException(
        `Version ${manifest.version} violates SemVer parameters`,
      );
    }

    return true;
  }

  async verifyChecksum(checksum: string, expected: string): Promise<boolean> {
    return checksum === expected;
  }
}
