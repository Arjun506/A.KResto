import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * Kernel Cache Domains configuration
 * TTL in seconds
 */
export const KERNEL_CACHE_CONFIG = {
  ORGANIZATION: { ttl: 3600, prefix: 'org:' },
  TENANT: { ttl: 3600, prefix: 'tenant:' },
  USER: { ttl: 7200, prefix: 'user:' },
  ROLE: { ttl: 7200, prefix: 'role:' },
  PERMISSIONS: { ttl: 1800, prefix: 'perm:' },
  SETTINGS: { ttl: 86400, prefix: 'settings:' },
} as const;

export const CACHE_CONFIG = KERNEL_CACHE_CONFIG;

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.cacheManager.set(key, value, ttl ?? 3600).then(() => undefined);
  }

  async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      await Promise.all(key.map((k) => this.cacheManager.del(k)));
      return;
    }
    await this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    await this.cacheManager.clear();
  }

  async remember<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined && cached !== null) return cached;

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  static generateKey(
    domain: keyof typeof KERNEL_CACHE_CONFIG,
    id: string,
    tenantId?: string,
  ): string {
    const prefix = KERNEL_CACHE_CONFIG[domain].prefix;
    return tenantId ? `${tenantId}:${prefix}${id}` : `${prefix}${id}`;
  }
}
