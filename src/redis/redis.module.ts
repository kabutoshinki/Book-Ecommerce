// import { CacheModule } from '@nestjs/cache-manager';
// import { Module } from '@nestjs/common';
// import * as redisStore from 'cache-manager-ioredis';

// @Module({
//   imports: [
//     CacheModule.registerAsync({
//         inject:
//       useFactory: () => ({
//         store: redisStore,
//         host: redisConfig.host,
//         port: redisConfig.port,
//       }),
//     }),
//   ],
//   exports: [CacheModule],
// })
// export class RedisCacheModule {}
