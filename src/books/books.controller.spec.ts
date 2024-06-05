import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { BooksQueryDto } from './dto/requests/books-query.dto';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            getBooks: jest.fn(),
            searchBooksByName: jest.fn(),
            getOnSaleBooks: jest.fn(),
            getBestSellingBooks: jest.fn(),
            getPopularBooks: jest.fn(),
            getBestBooks: jest.fn(),
            findByBookId: jest.fn(),
            getRelatedBooks: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const file = { path: 'test-file-path' } as Express.Multer.File;
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        price: 100,
        summary: 'summary',
        description: 'description',
        image: 'image',
        discountId: '307951ed-d362-4d87-9b5f-fedc631381c9',
        publisherId: '307951ed-d362-4d87-9b5f-fedc631381c9',
        categoryIds: ['307951ed-d362-4d87-9b5f-fedc631381c9'],
        authorIds: ['307951ed-d362-4d87-9b5f-fedc631381c9'],
        // other properties
      };
      const response = { success: true, message: 'Book created' };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      expect(await controller.create(file, createBookDto)).toBe(response);
      expect(service.create).toHaveBeenCalledWith(createBookDto, file);
    });
  });

  describe('getBooks', () => {
    it('should return paginated books', async () => {
      const query: BooksQueryDto = {};
      const response: Pagination<BookClientResponseDto> = {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
        },
      };
      jest.spyOn(service, 'getBooks').mockResolvedValue(response);

      expect(await controller.getBooks(query)).toBe(response);
      expect(service.getBooks).toHaveBeenCalledWith(query);
    });
  });
});
