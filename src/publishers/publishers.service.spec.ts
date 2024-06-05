// publishers.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';
import { Book } from '../books/entities/book.entity'; // Import the Book entity

describe('PublishersService', () => {
  let service: PublishersService;
  let publisherRepository: Repository<Publisher>;
  let bookRepository: Repository<Book>; // Define the bookRepository variable

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: getRepositoryToken(Publisher), // Provide the PublisherRepository token
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book), // Provide the BookRepository token
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
    publisherRepository = module.get<Repository<Publisher>>(
      getRepositoryToken(Publisher),
    ); // Get the repository instance
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book)); // Get the repository instance
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add other tests as needed
});
