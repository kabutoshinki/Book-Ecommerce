import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { DiscountsService } from '../discounts/discounts.service';
import { CategoriesService } from '../categories/categories.service';
import { AuthorsService } from '../authors/authors.service';
import { PublishersService } from '../publishers/publishers.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {}, // Mock repository
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
          useValue: {}, // Mock service
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
