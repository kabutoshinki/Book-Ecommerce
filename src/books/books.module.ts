import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DiscountsModule } from 'src/discounts/discounts.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { PublishersModule } from 'src/publishers/publishers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    DiscountsModule,
    AuthorsModule,
    CategoriesModule,
    PublishersModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
