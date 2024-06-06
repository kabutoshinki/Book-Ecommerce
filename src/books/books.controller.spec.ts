import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/requests/create-book.dto';
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
            getBooksOptions: jest.fn(),
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
        title: 'abc',
        description: 'abc',
        summary: 'abc',
        price: 50,
        image: 'abc',
        categoryIds: ['1'],
        authorIds: ['2'],
      };
      const response = { success: true, message: 'Book created' };
      jest.spyOn(service, 'create').mockResolvedValue(response);

      expect(await controller.create(file, createBookDto)).toBe(response);
      expect(service.create).toHaveBeenCalledWith(createBookDto, file);
    });
  });

  describe('searchBooks', () => {
    it('should return books matching the search query', async () => {
      const limit = 10;
      const name = 'search query';
      const response: BookClientResponseDto[] = [
        /* provide mock response */
      ];
      jest.spyOn(service, 'searchBooksByName').mockResolvedValue(response);

      expect(await controller.searchBooks(limit, name)).toBe(response);
      expect(service.searchBooksByName).toHaveBeenCalledWith(limit, name);
    });
  });

  describe('findOne', () => {
    it('should return a single book by ID', async () => {
      const id = 'test-id';
      const response: BookClientResponseDto = {
        /* provide mock response */
        id: 'avc',
        title: 'avc',
        description: 'avc',
        summary: 'avc',
        price: 40,
        image: 'avb',
        average_rate: 4,
        sold_quantity: 5,
      };
      jest.spyOn(service, 'findByBookId').mockResolvedValue(response);

      expect(await controller.findOne(id)).toBe(response);
      expect(service.findByBookId).toHaveBeenCalledWith(id);
    });
  });

  describe('relatedBooks', () => {
    it('should return related books based on the given book ID', async () => {
      const id = 'test-id';
      const limit = 3;
      const response: BookClientResponseDto[] = [
        /* provide mock response */
      ];
      jest.spyOn(service, 'getRelatedBooks').mockResolvedValue(response);

      expect(await controller.relatedBooks(id, limit)).toBe(response);
      expect(service.getRelatedBooks).toHaveBeenCalledWith(id, limit);
    });
  });
});
