import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, from } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { CacheService, CACHE_CONFIG } from './cache.service';

type CacheableResponse = { success: boolean } & Record<string, unknown>;

type EntityKey = keyof typeof CACHE_CONFIG;

type CacheGetRequest = Request & {
  params: { [key: string]: string | undefined };
};

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly cacheService: CacheService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType<'http'>() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<CacheGetRequest>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const pathParts = request.path.split('/').filter(Boolean);
    // Example paths (based on existing mapping): /restaurants/:id
    const entity = pathParts[pathParts.length - 2];
    const id = request.params?.id;

    const entityKey = this.getEntityKey(entity);
    if (!entityKey || !id) {
      return next.handle();
    }

    const config = CACHE_CONFIG[entityKey];
    const cacheKey = `${config.key}${id}`;

    return from(this.cacheService.get<CacheableResponse>(cacheKey)).pipe(
      switchMap((cached) => {
        if (cached) {
          return from(Promise.resolve(cached));
        }

        return next.handle().pipe(
          tap((response: unknown) => {
            // Cache only successful responses.
            if (
              typeof response === 'object' &&
              response !== null &&
              'success' in response &&
              (response as { success?: unknown }).success === true
            ) {
              void this.cacheService.set(
                cacheKey,
                response as CacheableResponse,
                config.ttl,
              );
            }
          }),
        );
      }),
    );
  }

  private getEntityKey(entity: string | undefined): EntityKey | null {
    if (!entity) return null;

    const mapping: Record<string, EntityKey> = {
      restaurants: 'RESTAURANTS',
      'menu-items': 'MENU_ITEMS',
      inventory: 'INVENTORY',
      users: 'USERS',
      orders: 'ORDERS',
      analytics: 'ANALYTICS',
    };

    return mapping[entity] ?? null;
  }
}
