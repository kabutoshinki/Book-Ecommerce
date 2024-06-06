import { IGetBooksOptions } from './../interfaces/BookPaginationOptions.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { DiscountsService } from '../discounts/discounts.service';
import { CategoriesService } from '../categories/categories.service';
import { AuthorsService } from '../authors/authors.service';
import { PublishersService } from '../publishers/publishers.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

const mockBooks = [
  {
    id: '1',
    title: 'Book 1',
    description: 'avc',
    summary: 'abv',
    price: 1,
    sold_quantity: 1,
    image: 'abc',
    isActive: true,
    average_rate: 4,
    categories: [],
    authors: [],
    orderItems: [],
    discount: null,
    publisher: null,
    reviews: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    title: 'Book 2',
    description: 'avc',
    summary: 'abv',
    price: 1,
    sold_quantity: 1,
    image: 'abc',
    isActive: true,
    average_rate: 4,
    categories: [],
    authors: [],
    orderItems: [],
    discount: null,
    publisher: null,
    reviews: [],
    created_at: new Date(),
    updated_at: new Date(),
  },
];

describe('BooksService', () => {
  let service: BooksService;
  let mockBookRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            // Mock repository
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: DiscountsService,
          useValue: {}, // Mock service
        },
        {
          provide: CategoriesService,
          useValue: {}, // Mock service
        },
        {
          provide: AuthorsService,
          useValue: {}, // Mock service
        },
        {
          provide: PublishersService,
          useValue: {}, // Mock service
        },
        {
          provide: CloudinaryService,
          useValue: {
            // Mock cloudinary service
            uploadFile: jest.fn().mockResolvedValue({ secure_url: 'mock_url' }),
            deleteFile: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    mockBookRepository = module.get(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return all books with relations', async () => {
      jest
        .spyOn(service['bookRepository'], 'find')
        .mockResolvedValue(mockBooks);

      const result = await service.findAll();

      expect(result).toEqual(mockBooks);
    });
  });

  describe('getTotalActiveBooks', () => {
    it('should return the total number of active books', async () => {
      const mockTotal = 10;
      jest
        .spyOn(service['bookRepository'], 'count')
        .mockResolvedValue(mockTotal);

      const result = await service.getTotalActiveBooks();

      expect(result).toEqual(mockTotal);
    });
  });
});
