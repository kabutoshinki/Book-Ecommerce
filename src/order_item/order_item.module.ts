import { Module } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { OrderItemController } from './order_item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order_item.entity';
import { BooksModule } from 'src/books/books.module';
import { OrderDetailsModule } from 'src/order_details/order_details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    BooksModule,
    OrderDetailsModule,
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
