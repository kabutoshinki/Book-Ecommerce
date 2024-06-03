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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('db Name: ', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LayoutMiddleware).forRoutes('*');

    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude('/page/login', {
    //     path: 'auth/server/login',
    //     method: RequestMethod.POST,
    //   })
    //   .forRoutes(
    //     '/',
    //     'page/about',
    //     'page/user',
    //     'page/book',
    //     'page/author',
    //     'page/category',
    //     'page/order',
    //     'page/order/:id',
    //     'page/discount',
    //     'page/publisher',
    //   );

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
