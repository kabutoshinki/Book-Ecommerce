import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { User } from './users/entities/user.entity';
import { OrderDetailsModule } from './order_details/order_details.module';
import { OrderItemModule } from './order_item/order_item.module';

import { CartItemModule } from './cart_item/cart_item.module';
import configuration from '../config/configuration';

import { Address } from './addresses/entities/address.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart_item/entities/cart_item.entity';

import { OrderDetail } from './order_details/entities/order_detail.entity';
import { OrderItem } from './order_item/entities/order_item.entity';
import { Category } from './categories/entities/category.entity';
import { AuthorsModule } from './authors/authors.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DiscountsModule } from './discounts/discounts.module';
import { PublishersModule } from './publishers/publishers.module';
import { BooksModule } from './books/books.module';
import { Discount } from './discounts/entities/discount.entity';
import { Book } from './books/entities/book.entity';
import { Review } from './reviews/entities/review.entity';
import { Author } from './authors/entities/author.entity';
import { Publisher } from './publishers/entities/publisher.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [
          User,
          Address,
          Cart,
          CartItem,
          OrderDetail,
          OrderItem,
          Category,
          Discount,
          Book,
          Review,
          Author,
          Publisher,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    AddressesModule,
    CategoriesModule,
    CartModule,
    OrderDetailsModule,
    OrderItemModule,
    CartItemModule,
    AuthorsModule,
    ReviewsModule,
    DiscountsModule,
    PublishersModule,

    BooksModule,
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
