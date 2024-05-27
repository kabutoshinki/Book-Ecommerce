import { formatDate } from 'src/utils/convert';
import { Injectable } from '@nestjs/common';
import { BookResponseDto } from './dto/responses/book-response.dto';
import { Book } from './entities/book.entity';
import { BookResponseForAdminDto } from './dto/responses/book-response-for-admin.dto';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { BookOrderResponseDto } from './dto/responses/book-order-response.dto';

@Injectable()
export class BookMapper {
  static toBookResponseDto(book: Book): BookResponseDto {
    const bookResponseDto = new BookResponseDto();
    bookResponseDto.id = book.id;
    bookResponseDto.title = book.title;
    bookResponseDto.description = book.description;
    bookResponseDto.summary = book.summary;
    bookResponseDto.price = book.price;
    bookResponseDto.discountId = book.discount?.id || null;
    bookResponseDto.publisherId = book.publisher?.id || null;
    bookResponseDto.categoryIds =
      book.categories?.map((category) => category.id) || [];
    bookResponseDto.authorIds = book.authors?.map((author) => author.id) || [];
    bookResponseDto.image = book.image;
    return bookResponseDto;
  }

  static toBookResponseForAdminDto(book: Book): BookResponseForAdminDto {
    const bookResponseForAdminDto = new BookResponseForAdminDto();
    bookResponseForAdminDto.id = book.id;
    bookResponseForAdminDto.title = book.title;
    bookResponseForAdminDto.description = book.description;
    bookResponseForAdminDto.summary = book.summary;
    bookResponseForAdminDto.price = book.price;
    bookResponseForAdminDto.sold_quantity = book.sold_quantity;
    bookResponseForAdminDto.discountId = book.discount?.id || null;
    bookResponseForAdminDto.publisherId = book.publisher?.id || null;
    bookResponseForAdminDto.categoryIds =
      book.categories?.map((category) => category.id) || [];
    bookResponseForAdminDto.authorIds =
      book.authors?.map((author) => author.id) || [];
    bookResponseForAdminDto.image = book.image;
    bookResponseForAdminDto.isActive = book.isActive;
    bookResponseForAdminDto.average_rate = book.average_rate;
    bookResponseForAdminDto.created_at = formatDate(book.created_at);
    bookResponseForAdminDto.updated_at = formatDate(book.updated_at);
    return bookResponseForAdminDto;
  }

  static toBookResponseForAdminDtoList(
    books: Book[],
  ): BookResponseForAdminDto[] {
    return books.map((book) => this.toBookResponseForAdminDto(book));
  }

  static toBookOrderResponseDto(book: Book): BookOrderResponseDto {
    const bookResponseForAdminDto = new BookOrderResponseDto();
    bookResponseForAdminDto.id = book.id;
    bookResponseForAdminDto.sold_quantity = book.sold_quantity;
    return bookResponseForAdminDto;
  }

  static toBookOrderResponseDtoList(books: Book[]): BookOrderResponseDto[] {
    return books.map((book) => this.toBookOrderResponseDto(book));
  }
  static toBookEntity(createBookDto: CreateBookDto): Book {
    const book = new Book();
    book.title = createBookDto.title;
    book.description = createBookDto.description;
    book.summary = createBookDto.summary;
    book.price = createBookDto.price;
    // Assigning relationships should be done separately,
    // possibly within the service that handles entity creation.
    return book;
  }

  static toUpdateBookEntity(
    existingBook: Book,
    updateBookDto: UpdateBookDto,
  ): Book {
    existingBook.title = updateBookDto.title ?? existingBook.title;
    existingBook.description =
      updateBookDto.description ?? existingBook.description;
    existingBook.summary = updateBookDto.summary ?? existingBook.summary;
    existingBook.price = updateBookDto.price ?? existingBook.price;

    return existingBook;
  }
}
