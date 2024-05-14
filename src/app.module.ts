import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { User } from './users/entities/user.entity';
import { OrderDetailsModule } from './order_details/order_details.module';
import { OrderItemModule } from './order_item/order_item.module';
import { SubCategoriesModule } from './sub_categories/sub_categories.module';
import { ProductAttributesModule } from './product_attributes/product_attributes.module';
import { ProductSkusModule } from './product_skus/product_skus.module';
import { CartItemModule } from './cart_item/cart_item.module';
import configuration from '../config/configuration';
import { Product } from './products/entities/product.entity';
import { Address } from './addresses/entities/address.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart_item/entities/cart_item.entity';
import { ProductSku } from './product_skus/entities/product_skus.entity';
import { ProductAttribute } from './product_attributes/entities/product_attribute.entity';
import { OrderDetail } from './order_details/entities/order_detail.entity';
import { OrderItem } from './order_item/entities/order_item.entity';
import { Category } from './categories/entities/category.entity';
import { SubCategory } from './sub_categories/entities/sub_category.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';

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
          Product,
          Address,
          Cart,
          CartItem,
          ProductSku,
          ProductAttribute,
          OrderDetail,
          OrderItem,
          Category,
          SubCategory,
          Wishlist,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    AddressesModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    WishlistsModule,
    OrderDetailsModule,
    OrderItemModule,
    SubCategoriesModule,
    ProductAttributesModule,
    ProductSkusModule,
    CartItemModule,
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
