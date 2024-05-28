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
import {
  FindManyOptions,
  In,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { PublishersService } from 'src/publishers/publishers.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BookResponseForAdminDto } from './dto/responses/book-response-for-admin.dto';
import { BookMapper } from './books.mapper';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';

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
      await this.bookRepository.save(book);

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

  async findAll() {
    return await this.bookRepository.find({
      relations: ['publisher', 'discount', 'authors', 'categories'],
    });
  }
  async findAllForAdmin(): Promise<BookResponseForAdminDto[]> {
    const books = await this.bookRepository.find({
      relations: ['publisher', 'discount', 'authors', 'categories'],
    });
    return BookMapper.toBookResponseForAdminDtoList(books);
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

  async getOnSaleBooks(limit = 5): Promise<BookClientResponseDto[]> {
    const currentDate = new Date();

    const onSaleBook = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.discount', 'discount')
      .leftJoinAndSelect('book.categories', 'categories')
      .where('discount IS NOT NULL')
      .andWhere('discount.startAt <= :currentDate', { currentDate })
      .andWhere('discount.expiresAt >= :currentDate', { currentDate })
      .orderBy('discount.amount', 'DESC')
      .take(limit)
      .getMany();
    return BookMapper.toBookClientResponseDtoList(onSaleBook);
  }

  async getBestSellingBooks(limit = 5): Promise<BookClientResponseDto[]> {
    const popularBooks = await this.bookRepository.find({
      relations: ['discount', 'authors', 'categories'],
      order: { sold_quantity: 'DESC' },
      take: limit,
    });
    return BookMapper.toBookClientResponseDtoList(popularBooks);
  }

  async getPopularBooks(
    limit = 5,
    categoryName?: string,
  ): Promise<BookClientResponseDto[]> {
    const currentDate = new Date();
    const queryOptions: FindManyOptions<Book> = {
      relations: ['publisher', 'discount', 'authors', 'categories'],
      order: { average_rate: 'DESC' },
      take: limit,
    };

    if (categoryName && categoryName !== 'all' && categoryName.trim() !== '') {
      queryOptions.where = { categories: { name: categoryName } };
    }

    const featuredBooks = await this.bookRepository.find(queryOptions);
    return BookMapper.toBookClientResponseDtoList(featuredBooks);
  }

  async getBestBooks(limit = 3): Promise<BookClientResponseDto[]> {
    const bestBooks = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.discount', 'discount')
      .orderBy('book.sold_quantity', 'DESC')
      .addOrderBy('book.average_rate', 'DESC')
      .addOrderBy('discount.amount', 'DESC')
      .take(limit)
      .getMany();
    return BookMapper.toBookClientResponseDtoList(bestBooks);
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

  async paginateBookAdmin(
    options: IPaginationOptions,
    searchQuery?: string,
  ): Promise<Pagination<BookResponseForAdminDto>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 6;

    let queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.discount', 'discount')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .orderBy('book.created_at', 'DESC');

    if (searchQuery) {
      queryBuilder = queryBuilder
        .where('book.title LIKE :searchQuery', {
          searchQuery: `%${searchQuery}%`,
        })
        .orWhere('book.description LIKE :searchQuery', {
          searchQuery: `%${searchQuery}%`,
        });
    }

    const [books, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const paginatedBooksDto = BookMapper.toBookResponseForAdminDtoList(books);

    const paginationMeta = {
      totalItems: totalItems,
      itemCount: books.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
    const paginationLinks = {
      first: `${options.route}?page=1&limit=${limit}`,
      previous:
        page > 1 ? `${options.route}?page=${page - 1}&limit=${limit}` : '',
      next:
        page < paginationMeta.totalPages
          ? `${options.route}?page=${page + 1}&limit=${limit}`
          : '',
      last: `${options.route}?page=${paginationMeta.totalPages}&limit=${limit}`,
    };

    return new Pagination<BookResponseForAdminDto>(
      paginatedBooksDto,
      paginationMeta,
      paginationLinks,
    );
  }
}
