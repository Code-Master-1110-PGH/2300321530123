/**
 * Example cache implementation
 * Demonstrates how to structure caching layer
 */

import Logger from '../../common/middleware/logger';

const logger = new Logger();

export class CacheManager {
  private cache = new Map<string, { value: any; expiry: number }>();

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await logger.debug('cache', `Setting cache for key: ${key}`, 'backend');
      const expiry = Date.now() + ttl * 1000;
      this.cache.set(key, { value, expiry });
    } catch (error: any) {
      await logger.error('cache', `Cache set error: ${error.message}`, 'backend');
    }
  }

  async get(key: string): Promise<any> {
    try {
      const cached = this.cache.get(key);

      if (!cached) {
        return null;
      }

      if (Date.now() > cached.expiry) {
        this.cache.delete(key);
        return null;
      }

      await logger.debug('cache', `Cache hit for key: ${key}`, 'backend');
      return cached.value;
    } catch (error: any) {
      await logger.error('cache', `Cache get error: ${error.message}`, 'backend');
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      await logger.debug('cache', `Invalidating cache for key: ${key}`, 'backend');
      this.cache.delete(key);
    } catch (error: any) {
      await logger.error('cache', `Cache invalidate error: ${error.message}`, 'backend');
    }
  }
}
