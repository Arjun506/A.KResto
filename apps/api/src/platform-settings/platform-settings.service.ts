import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type SettingsScope = 'SYSTEM' | 'TENANT' | 'ORGANIZATION' | 'USER';

@Injectable()
export class PlatformSettingsService {
  private readonly logger = new Logger(PlatformSettingsService.name);
  private readonly inMemorySettings = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  private getCompositeKey(
    scope: SettingsScope,
    entityId: string,
    key: string,
  ): string {
    return `${scope}:${entityId}:${key}`;
  }

  async getSetting<T = any>(
    scope: SettingsScope,
    entityId: string,
    key: string,
    defaultValue?: T,
  ): Promise<T> {
    const compositeKey = this.getCompositeKey(scope, entityId, key);
    if (this.inMemorySettings.has(compositeKey)) {
      return this.inMemorySettings.get(compositeKey);
    }
    return defaultValue as T;
  }

  async setSetting<T = any>(
    scope: SettingsScope,
    entityId: string,
    key: string,
    value: T,
  ): Promise<void> {
    const compositeKey = this.getCompositeKey(scope, entityId, key);
    this.inMemorySettings.set(compositeKey, value);
    this.logger.log(`[PlatformSettings] Set setting ${compositeKey}`);
  }

  async deleteSetting(
    scope: SettingsScope,
    entityId: string,
    key: string,
  ): Promise<boolean> {
    const compositeKey = this.getCompositeKey(scope, entityId, key);
    return this.inMemorySettings.delete(compositeKey);
  }
}
