import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Options,
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
          ttl: 60 * 60 * 24 * 7,
          socket: {
            host: 'localhost',
            port: 6380,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log('db Name: ', dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    console.log('');
  }
}
