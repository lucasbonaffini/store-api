/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheController } from '../../../delivery/controllers/cache.controller';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL');
        if (redisUrl) {
          console.log('Using Redis cache with URL:', redisUrl);
          return {
            store: redisStore,
            url: redisUrl,
            ttl: 60 * 60, // Cache for 1 hour
            max: 100,
            isGlobal: true,
          };
        }
        console.log('Using in-memory cache');
        return {
          ttl: 60 * 60, // Cache for 1 hour in memory
          max: 100,
          isGlobal: true,
        };
      },
    }),
  ],
  controllers: [CacheController],
  exports: [NestCacheModule],
})
export class CacheModule {}
