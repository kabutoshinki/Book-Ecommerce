import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Options,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { OrderDetailsModule } from './order_details/order_details.module';
import { OrderItemModule } from './order_item/order_item.module';
import configuration from '../config/configuration';
import { AuthorsModule } from './authors/authors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PublishersModule } from './publishers/publishers.module';
import { BooksModule } from './books/books.module';
import { getTypeOrmConfig } from 'config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CartModule } from './cart/cart.module';
import { LayoutMiddleware } from './middleware/layout.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthMiddleware } from './middleware/authenticate.middleware';
import { PaymentModule } from './payment/payment.module';
import { LockModule } from './lock/lock.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 20,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        return { store };
      },
    }),

    AuthModule,
    UsersModule,
    AddressesModule,
    CategoriesModule,
    OrderDetailsModule,
    OrderItemModule,
    AuthorsModule,
    ReviewsModule,
    DiscountsModule,
    PublishersModule,
    BooksModule,
    CartModule,
    CloudinaryModule,
    PaymentModule,
    LockModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LayoutMiddleware).forRoutes('*');

    consumer
      .apply(AuthMiddleware)
      .exclude('/page/login')
      .forRoutes(
        { path: '/', method: RequestMethod.ALL },
        { path: 'page/about', method: RequestMethod.ALL },
        { path: 'page/user', method: RequestMethod.ALL },
        { path: 'page/book', method: RequestMethod.ALL },
        { path: 'page/author', method: RequestMethod.ALL },
        { path: 'page/category', method: RequestMethod.ALL },
        { path: 'page/order', method: RequestMethod.ALL },
        { path: 'page/order/:id', method: RequestMethod.ALL },
        { path: 'page/discount', method: RequestMethod.ALL },
        { path: 'page/publisher', method: RequestMethod.ALL },
        { path: 'page/review', method: RequestMethod.ALL },
      );
  }
}
