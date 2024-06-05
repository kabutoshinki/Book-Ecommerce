import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BooksService } from '../books/books.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          }, // Mock cache manager
        },
        {
          provide: BooksService,
          useValue: {}, // Mock BooksService
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
