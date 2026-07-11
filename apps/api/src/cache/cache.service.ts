import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

/**
 * Cache configuration by entity type
 * TTL in seconds
 */
export const CACHE_CONFIG = {
  RESTAURANTS: { ttl: 3600, key: 'restaurant:' }, // 1 hour
  MENU_ITEMS: { ttl: 1800, key: 'menu:' }, // 30 minutes
  INVENTORY: { ttl: 300, key: 'inventory:' }, // 5 minutes
  USERS: { ttl: 7200, key: 'user:' }, // 2 hours
  ORDERS: { ttl: 600, key: 'order:' }, // 10 minutes
  ANALYTICS: { ttl: 3600, key: 'analytics:' }, // 1 hour
} as const;

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get value from cache
   */
  get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  /**
   * Set value in cache with custom TTL
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void> {
    return this.cacheManager.set(key, value, ttl ?? 3600).then(() => undefined);
  }

  /**
   * Delete cache key
   */
  async del(key: string | string[]): Promise<void> {
    if (Array.isArray(key)) {
      await Promise.all(key.map((k) => this.cacheManager.del(k)));
      return;
    }

    await this.cacheManager.del(key);
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    // cache-manager types do not guarantee a reset() method.
    await this.cacheManager.clear();
  }

  /**
   * Cache wrapper - execute function and cache result
   */
  async remember<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  /**
   * Generate cache key for entity
   */
  static generateKey(entity: string, id: string, prefix?: string): string {
    const base = `${entity}:${id}`;
    return prefix ? `${prefix}:${base}` : base;
  }

  /**
   * Generate pattern for invalidating multiple cache entries
   */
  static generatePattern(entity: string, ...ids: string[]): string[] {
    return ids.map((id) => `${entity}:${id}`);
  }
}
