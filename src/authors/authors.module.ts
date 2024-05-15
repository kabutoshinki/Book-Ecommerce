import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { BooksModule } from 'src/books/books.module';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
