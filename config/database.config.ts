import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { User } from 'src/users/entities/user.entity';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.user'),
  password: configService.get('database.password'),
  database: configService.get('database.name'),
  entities: [
    User,
    Address,
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
});
