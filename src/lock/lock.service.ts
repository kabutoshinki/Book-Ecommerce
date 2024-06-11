import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class LockService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async acquireLock(key: string, ttl: number): Promise<boolean> {
    const lockValue = 'LOCK';
    const existingLock = await this.cacheManager.get(key);

    if (!existingLock) {
      await this.cacheManager.set(key, lockValue, ttl);
      return true;
    }

    return false;
  }

  async releaseLock(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
