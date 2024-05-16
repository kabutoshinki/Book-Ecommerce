import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions {
    return {
      store: 'redis',
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
    };
  }
}
