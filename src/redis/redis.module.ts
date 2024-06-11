import { Module } from '@nestjs/common';
import { RedisManageService } from './redis.service';

@Module({
  providers: [RedisManageService],
  exports: [RedisManageService],
})
export class RedisModule {}
