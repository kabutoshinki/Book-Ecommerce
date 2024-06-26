import { DiscountMapper } from './../discounts/discounts,mapper';
import { formatDate } from '../utils/convert';
import { Injectable } from '@nestjs/common';
import { BookResponseDto } from './dto/responses/book-response.dto';
import { Book } from './entities/book.entity';
import { BookResponseForAdminDto } from './dto/responses/book-response-for-admin.dto';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { BookOrderResponseDto } from './dto/responses/book-order-response.dto';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';
import { PublisherMapper } from '../publishers/publishers.mapper';
import { CategoryMapper } from '../categories/categories.mapper';
import { AuthorMapper } from '../authors/authors.mapper';
import { BookReviewResponseDto } from './dto/responses/books-reviews-response.dto';
import { ReviewMapper } from '../reviews/reviews.mapper';

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

  static toBooksClientResponseDto(book: Book): BookClientResponseDto {
    const stripTime = (date: Date): Date =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const currentDateOnly = stripTime(new Date());

    const bookResponseDto = new BookClientResponseDto();
    bookResponseDto.id = book.id;
    bookResponseDto.title = book.title;
    bookResponseDto.description = book.description;
    bookResponseDto.summary = book.summary;
    bookResponseDto.price = parseInt(book.price.toString());
    bookResponseDto.average_rate = book.average_rate;
    bookResponseDto.sold_quantity = book.sold_quantity;
    bookResponseDto.image = book.image;

    if (book.discount?.isActive) {
      const discountStartAtOnly = stripTime(new Date(book.discount.startAt));
      const discountExpiresAtOnly = stripTime(
        new Date(book.discount.expiresAt),
      );

      if (
        discountStartAtOnly <= currentDateOnly &&
        discountExpiresAtOnly >= currentDateOnly
      ) {
        bookResponseDto.discount = DiscountMapper.toDiscountResponseDto(
          book.discount,
        );
      }
    }

    if (book.publisher) {
      bookResponseDto.publisher = PublisherMapper.toPublisherResponseDto(
        book.publisher,
      );
    }

    if (book.categories) {
      bookResponseDto.categories = CategoryMapper.toCategoryResponseDtoList(
        book.categories,
      );
    }

    if (book.authors) {
      bookResponseDto.authors = AuthorMapper.toAuthorResponseDtoList(
        book.authors,
      );
    }

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
  static toBookClientResponseDtoList(books: Book[]): BookClientResponseDto[] {
    return books.map((book) => this.toBooksClientResponseDto(book));
  }

  static toBooksReviewResponseDto(book: Book): BookReviewResponseDto {
    const bookResponseForAdminDto = new BookReviewResponseDto();
    bookResponseForAdminDto.id = book.id;
    bookResponseForAdminDto.image = book.image;
    bookResponseForAdminDto.title = book.title;
    bookResponseForAdminDto.description = book.description;
    bookResponseForAdminDto.price = book.price;
    bookResponseForAdminDto.isActive = book.isActive;
    bookResponseForAdminDto.sold_quantity = book.sold_quantity;
    bookResponseForAdminDto.review_quantity = book.reviews.length || 0;
    bookResponseForAdminDto.average_rate = book.average_rate;
    bookResponseForAdminDto.reviews = ReviewMapper.toReviewListResponseDtoList(
      book.reviews,
    );
    return bookResponseForAdminDto;
  }
  static toBooksReviewResponseDtoList(books: Book[]): BookReviewResponseDto[] {
    return books.map((book) => this.toBooksReviewResponseDto(book));
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
