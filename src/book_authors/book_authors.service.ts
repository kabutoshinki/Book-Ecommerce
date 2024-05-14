import { Injectable } from '@nestjs/common';
import { CreateBookAuthorDto } from './dto/create-book_author.dto';
import { UpdateBookAuthorDto } from './dto/update-book_author.dto';

@Injectable()
export class BookAuthorsService {
  create(createBookAuthorDto: CreateBookAuthorDto) {
    return 'This action adds a new bookAuthor';
  }

  findAll() {
    return `This action returns all bookAuthors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookAuthor`;
  }

  update(id: number, updateBookAuthorDto: UpdateBookAuthorDto) {
    return `This action updates a #${id} bookAuthor`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookAuthor`;
  }
}
