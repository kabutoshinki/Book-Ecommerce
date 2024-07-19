import { IGetBooksOptions } from './../interfaces/BookPaginationOptions.interface';
import { BookListType } from './../enums/book.enum';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Brackets, FindManyOptions, In, Like, Repository } from 'typeorm';
import { PublishersService } from '../publishers/publishers.service';
import { AuthorsService } from '../authors/authors.service';
import { DiscountsService } from '../discounts/discounts.service';
import { CategoriesService } from '../categories/categories.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BookResponseForAdminDto } from './dto/responses/book-response-for-admin.dto';
import { BookMapper } from './books.mapper';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';
import { BooksQueryDto } from './dto/requests/books-query.dto';
import { BookReviewResponseDto } from './dto/responses/books-reviews-response.dto';
import { GetBooksOptions } from 'src/interfaces/GetBooksOptions.interface';
import { SearchService } from 'src/search/search.service';
import { error } from 'console';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly discountService: DiscountsService,
    private readonly categoryService: CategoriesService,
    private readonly authorService: AuthorsService,
    private readonly publisherService: PublishersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly searchService: SearchService,
  ) {}
  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      createBookDto;

    const book = this.bookRepository.create(bookData);
    let uploadResult;
    try {
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'books');
        book.image = uploadResult.secure_url;
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

      if (categoryIds && categoryIds.length > 0) {
        const categories = await this.categoryService.findByIds(categoryIds);
        book.categories = categories;
      }

      if (authorIds && authorIds.length > 0) {
        const authors = await this.authorService.findByIds(authorIds);
        book.authors = authors;
      }
      const createdBook = await this.bookRepository.save(book);
      await this.searchService.indexData('books_index', createdBook.id, {
        title: createdBook.title,
        description: createdBook.description,
        summary: createdBook.summary,
        sold_quantity: createdBook.sold_quantity,
        image: createdBook.image,
        price: createdBook.price,
        createdAt: createdBook.created_at,
      });
      return {
        success: true,
        message: 'Book created',
      };
    } catch (error) {
      if (uploadResult) {
        // Delete the uploaded image if an error occurred after uploading the image
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      console.log(error);

      throw new InternalServerErrorException(
        'Error creating book, changes reverted',
      );
    }
  }

  async getTotalActiveBooks(): Promise<number> {
    return await this.bookRepository.count({ where: { isActive: true } });
  }

  async findAll() {
    return await this.bookRepository.find({
      relations: ['publisher', 'discount', 'authors', 'categories'],
    });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOneBy({ id: id });
    if (!book) {
      throw new NotFoundException('Book not exist');
    }
    return book;
  }

  async getBooksOptions(
    options: GetBooksOptions,
  ): Promise<BookClientResponseDto[]> {
    const { type, limit = 5, categoryName, sortBy } = options;
    const currentDate = new Date();
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.discount', 'discount')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('book.publisher', 'publisher');
    if (type === BookListType.ON_SALE) {
      queryBuilder
        .where('discount IS NOT NULL')
        .andWhere('discount.startAt <= :currentDate', { currentDate })
        .andWhere('discount.expiresAt >= :currentDate', { currentDate });
    }
    if (
      type === BookListType.POPULAR &&
      categoryName &&
      categoryName.trim() !== '' &&
      categoryName !== 'all'
    ) {
      queryBuilder.andWhere('categories.name = :categoryName', {
        categoryName,
      });
    }

    if (sortBy && sortBy.length > 0) {
      sortBy.forEach((criteria, index) => {
        if (index === 0) {
          queryBuilder.orderBy(criteria, 'DESC');
        } else {
          queryBuilder.addOrderBy(criteria, 'DESC');
        }
      });
    } else {
      switch (type) {
        case BookListType.ON_SALE:
          queryBuilder.orderBy('discount.amount', 'DESC');
          break;
        case BookListType.BEST_SELLING:
          queryBuilder.orderBy('book.sold_quantity', 'DESC');
          break;
        case BookListType.POPULAR:
          queryBuilder.orderBy('book.average_rate', 'DESC');
          break;
        case BookListType.BEST:
          queryBuilder
            .orderBy('book.sold_quantity', 'DESC')
            .addOrderBy('book.average_rate', 'DESC')
            .addOrderBy('discount.amount', 'DESC');
          break;
        default:
          throw new Error('Invalid book list type');
      }
    }

    queryBuilder.take(limit);

    const books = await queryBuilder.getMany();
    return BookMapper.toBookClientResponseDtoList(books);
  }

  async findByIds(ids: string[]) {
    const books = await this.bookRepository.find({
      where: { id: In(ids) },
      relations: ['discount'],
    });
    if (books.length !== ids.length) {
      throw new NotFoundException('Some books not found');
    }
    return books;
  }

  async findByBookId(id: string): Promise<BookClientResponseDto> {
    const book = await this.bookRepository.findOne({
      where: { id, isActive: true },
      relations: ['discount', 'authors', 'categories', 'publisher'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return BookMapper.toBooksClientResponseDto(book);
  }
  async getRelatedBooks(
    id: string,
    limit: number,
  ): Promise<BookClientResponseDto[]> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['categories', 'authors'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const relatedBooksQuery = this.bookRepository
      .createQueryBuilder('book')
      .innerJoinAndSelect('book.categories', 'category')
      .innerJoinAndSelect('book.authors', 'author')
      .where('book.id != :id', { id })
      .andWhere('book.isActive = true');

    const categoryIds = book.categories.map((category) => category.id);
    const authorIds = book.authors.map((author) => author.id);

    relatedBooksQuery.andWhere(
      new Brackets((qb) => {
        qb.where('category.id IN (:...categoryIds)', { categoryIds });
        if (authorIds.length > 0) {
          qb.orWhere('author.id IN (:...authorIds)', { authorIds });
        }
      }),
    );

    relatedBooksQuery
      .orderBy('book.average_rate', 'DESC')
      .addOrderBy('book.sold_quantity', 'DESC');
    const relatedBooks = await relatedBooksQuery.take(limit).getMany();

    return BookMapper.toBookClientResponseDtoList(relatedBooks);
  }

  async searchBooksByName(
    limit: number,
    name: string,
  ): Promise<BookClientResponseDto[]> {
    const queryOptions: FindManyOptions<Book> = {
      relations: ['discount', 'categories'],
      where: { title: Like(`%${name}%`) },
      take: limit,
    };

    const books = await this.bookRepository.find(queryOptions);
    return BookMapper.toBookClientResponseDtoList(books);
  }

  async searchBooks(limit: number, query: string, page = 1) {
    console.log(query);
    // Searching books in Elasticsearch
    const result = await this.searchService.searchData(
      'books_index',
      query,
      limit,
      page,
    );
    console.log(result);

    if (result.hits.length > 0) {
      return {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        hits: result.hits,
      };
    } else {
      throw new NotFoundException('No books found');
    }
  }

  async update(
    id: string,
    updateBookDto: Partial<UpdateBookDto>,
    file: Express.Multer.File,
  ) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      updateBookDto;
    let uploadResult;

    try {
      const book = await this.findOne(id);
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'books');
        if (book.image.startsWith('https://res.cloudinary.com')) {
          const urlParts = book.image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];

          await this.cloudinaryService.deleteFile(`books/${publicId}`);
        }
        book.image = uploadResult.secure_url;
      }
      if (discountId) {
        const discount = await this.discountService.findOne(discountId);
        book.discount = discount;
      }

      if (publisherId) {
        const publisher = await this.publisherService.findOne(publisherId);
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
      book.isActive = true;
      Object.assign(book, bookData);
      await this.bookRepository.save(book);

      return {
        success: true,
        message: 'Book Updated',
      };
    } catch (error) {
      console.log(error);
      if (uploadResult) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    book.isActive = false;
    await this.bookRepository.save(book);
    return 'Book deleted';
  }

  async paginateBooks(
    options: IGetBooksOptions,
  ): Promise<
    Pagination<
      BookClientResponseDto | BookResponseForAdminDto | BookReviewResponseDto
    >
  > {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;

    let queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.discount', 'discount')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories');

    if (options.includeReviews) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('book.reviews', 'review')
        .leftJoinAndSelect('review.reviewer', 'reviewer');
    }

    if (options.isActive !== undefined) {
      queryBuilder.where('book.isActive = :isActive', {
        isActive: options.isActive,
      });
    }

    if (options.search) {
      queryBuilder.andWhere(
        '(book.title LIKE :search OR book.description LIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    if (options.categories && options.categories.length > 0) {
      queryBuilder.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('book.id')
            .from('book', 'book')
            .leftJoin('book.categories', 'category')
            .where('category.id IN (:...categories)')
            .getQuery();

          return `book.id IN ${subQuery}`;
        },
        { categories: options.categories },
      );
    }

    if (options.authors && options.authors.length > 0) {
      queryBuilder.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('book.id')
            .from('book', 'book')
            .leftJoin('book.authors', 'author')
            .where('author.id IN (:...authors)')
            .getQuery();

          return `book.id IN ${subQuery}`;
        },
        { authors: options.authors },
      );
    }

    if (options.minPrice !== undefined) {
      queryBuilder.andWhere('book.price >= :minPrice', {
        minPrice: options.minPrice,
      });
    }

    if (options.maxPrice !== undefined) {
      queryBuilder.andWhere('book.price <= :maxPrice', {
        maxPrice: options.maxPrice,
      });
    }

    if (options.minRate !== undefined) {
      queryBuilder.andWhere('book.average_rate >= :minRate', {
        minRate: options.minRate,
      });
    }

    if (options.maxRate !== undefined) {
      queryBuilder.andWhere('book.average_rate <= :maxRate', {
        maxRate: options.maxRate,
      });
    }

    switch (options.sort) {
      case 'priceLow':
        queryBuilder.orderBy('book.price', 'ASC');
        break;
      case 'priceHigh':
        queryBuilder.orderBy('book.price', 'DESC');
        break;
      case 'popularity':
        queryBuilder.orderBy('book.average_rate', 'DESC');
        break;
      case 'onSale':
        queryBuilder
          .orderBy('discount.amount', 'DESC')
          .addOrderBy('book.price', 'ASC');
        break;
      default:
        queryBuilder.orderBy('book.created_at', 'DESC');
    }

    const [books, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    let paginatedBooksDto;
    if (options.includeReviews) {
      paginatedBooksDto = BookMapper.toBooksReviewResponseDtoList(books);
    } else {
      paginatedBooksDto =
        options.isActive !== undefined
          ? BookMapper.toBookClientResponseDtoList(books)
          : BookMapper.toBookResponseForAdminDtoList(books);
    }

    const paginationMeta = {
      totalItems,
      itemCount: books.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return new Pagination<
      BookClientResponseDto | BookResponseForAdminDto | BookReviewResponseDto
    >(paginatedBooksDto, paginationMeta);
  }
}
