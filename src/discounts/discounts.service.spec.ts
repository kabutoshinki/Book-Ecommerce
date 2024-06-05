import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Book } from '../books/entities/book.entity';
import { Repository } from 'typeorm';

describe('DiscountsService', () => {
  let service: DiscountsService;
  let discountRepository: Repository<Discount>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountsService,
        {
          provide: getRepositoryToken(Discount),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
    discountRepository = module.get<Repository<Discount>>(
      getRepositoryToken(Discount),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional tests can be added here
});
