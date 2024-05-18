import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { In, Repository } from 'typeorm';
import { PublishersService } from 'src/publishers/publishers.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly discountService: DiscountsService,
    private readonly categoryService: CategoriesService,
    private readonly authorService: AuthorsService,
    private readonly publisherService: PublishersService,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      createBookDto;

    const book = this.bookRepository.create(bookData);

    if (discountId) {
      const discount = await this.discountService.findOne(discountId);
      if (!discount) {
        throw new NotFoundException('Discount not found');
      }
      book.discount = discount;
    }

    if (publisherId) {
      const publisher = await this.publisherService.findOne(publisherId);
      if (!publisher) {
        throw new NotFoundException('Publisher not found');
      }
      book.publisher = publisher;
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryService.findByIds(categoryIds);
      book.categories = categories;
    }

    if (authorIds && authorIds.length > 0) {
      const authors = await this.authorService.findByIds(authorIds);
      book.authors = authors;
    }

    return this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOneBy({ id: id });
    if (!book) {
      throw new NotFoundException('Book not exist');
    }
    return book;
  }

  async findByIds(ids: string[]) {
    const books = await this.bookRepository.findBy({ id: In(ids) });
    if (books.length !== ids.length) {
      throw new NotFoundException('Some books not found');
    }
    return books;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      updateBookDto;
    try {
      const book = await this.bookRepository.findOneBy({ id: id });
      if (!book) {
        throw new NotFoundException('Book not exist');
      }
      if (discountId) {
        const discount = await this.discountService.findOne(discountId);
        if (!discount) {
          throw new NotFoundException('Discount not found');
        }
        book.discount = discount;
      }

      if (publisherId) {
        const publisher = await this.publisherService.findOne(publisherId);
        if (!publisher) {
          throw new NotFoundException('Publisher not found');
        }
        book.publisher = publisher;
      }

      if (categoryIds) {
        const categories = await this.categoryService.findByIds(categoryIds);
        book.categories = categories;
      }

      if (authorIds) {
        const authors = await this.authorService.findByIds(authorIds);
        book.authors = authors;
      }

      Object.assign(book, bookData);

      return this.bookRepository.save(book);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const book = await this.bookRepository.findOneBy({ id: id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.bookRepository.remove(book);
    return 'Book deleted';
  }
}
