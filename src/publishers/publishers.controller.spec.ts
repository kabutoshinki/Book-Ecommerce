// publishers.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';
import { Book } from '../books/entities/book.entity'; // Import the Book entity

describe('PublishersController', () => {
  let controller: PublishersController;
  let service: PublishersService;
  let publisherRepository: Repository<Publisher>;
  let bookRepository: Repository<Book>; // Define the bookRepository variable

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
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

    controller = module.get<PublishersController>(PublishersController);
    service = module.get<PublishersService>(PublishersService);
    publisherRepository = module.get<Repository<Publisher>>(
      getRepositoryToken(Publisher),
    ); // Get the repository instance
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book)); // Get the repository instance
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add other tests as needed
});
