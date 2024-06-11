import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisManageService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: any, ttl = 20000): Promise<void> {
    await this.cacheManager.set(key, value, ttl * 1000);
  }

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }
}
