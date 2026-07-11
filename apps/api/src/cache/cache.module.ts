import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

import redisStore from 'cache-manager-redis-store';

type RedisStoreFactory = Record<string, unknown>;

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const store = redisStore as unknown as RedisStoreFactory;

        return {
          store,
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          ttl: 3600,
          max: 10000,
          isGlobal: true,
        };
      },
    }),
  ],
})
export class CacheConfigModule {}
