/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Delete,
  Inject,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('cache')
@Controller('cache')
export class CacheController {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Get('status')
  @ApiOperation({ summary: 'Get cache status' })
  @ApiResponse({
    status: 200,
    description: 'Returns cache status information',
  })
  async getStatus() {
    // Get all keys (this is a simple example, may not work with all stores)
    const keys = await this.getKeys();

    // Check if Redis is connected
    const cacheManagerAny = this.cacheManager as any;
    let cacheType = 'In-memory';

    try {
      // Attempt different ways to detect Redis
      if (
        cacheManagerAny.stores?.[0]?.name?.toLowerCase?.().includes('redis')
      ) {
        cacheType = 'Redis';
      } else if (
        cacheManagerAny.stores?.[0]?.client?.options?.name
          ?.toLowerCase?.()
          .includes('redis')
      ) {
        cacheType = 'Redis';
      }
    } catch (error) {
      console.debug('Error detecting cache type: ' + String(error));
    }

    return {
      status: 'active',
      type: cacheType,
      keys: keys,
      keysCount: keys.length,
    };
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all cache' })
  @ApiResponse({
    status: 204,
    description: 'Cache cleared successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearCache() {
    // Clear all known keys
    const keys = await this.getKeys();
    for (const key of keys) {
      await this.cacheManager.del(key);
    }
    return null;
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete specific cache key' })
  @ApiParam({ name: 'key', description: 'Cache key to delete' })
  @ApiResponse({
    status: 204,
    description: 'Cache key deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteKey(@Param('key') key: string) {
    await this.cacheManager.del(key);
    return null;
  }

  // Helper method to try to get all cache keys
  private async getKeys(): Promise<string[]> {
    try {
      // This will only work if the cache manager store has a getKeys method
      // (Redis client has this, memory store might not)
      const cacheManagerAny = this.cacheManager as any;

      // Try different access patterns to find getKeys method
      if (
        cacheManagerAny.stores?.[0] &&
        typeof cacheManagerAny.stores[0].getKeys === 'function'
      ) {
        return await cacheManagerAny.stores[0].getKeys();
      }

      if (typeof cacheManagerAny.getKeys === 'function') {
        return await cacheManagerAny.getKeys();
      }

      if (
        cacheManagerAny.stores?.[0]?.client &&
        typeof cacheManagerAny.stores[0].client.keys === 'function'
      ) {
        // Redis specific - get all keys with pattern matching
        const keys = await cacheManagerAny.stores[0].client.keys('*');
        return Array.isArray(keys) ? keys : [];
      }

      // Fallback for stores without getKeys
      console.log('Using fallback cache keys - no store.getKeys method found');
      return ['all_products', 'product_by_id'];
    } catch (error) {
      console.error(
        'Error getting cache keys:',
        error instanceof Error ? error.message : String(error),
      );
      return [];
    }
  }
}
