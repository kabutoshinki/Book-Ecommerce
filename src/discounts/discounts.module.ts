import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, Book])],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService],
})
export class DiscountsModule {}
