import { Module } from '@nestjs/common';
import { BookAuthorsService } from './book_authors.service';
import { BookAuthorsController } from './book_authors.controller';

@Module({
  controllers: [BookAuthorsController],
  providers: [BookAuthorsService]
})
export class BookAuthorsModule {}
