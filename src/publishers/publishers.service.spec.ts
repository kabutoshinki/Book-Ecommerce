import { Test, TestingModule } from '@nestjs/testing';
import { PublishersService } from './publishers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';
import { Book } from '../books/entities/book.entity';

describe('PublishersService', () => {
  let service: PublishersService;
  let publisherRepository: Repository<Publisher>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishersService,
        {
          provide: getRepositoryToken(Publisher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PublishersService>(PublishersService);
    publisherRepository = module.get<Repository<Publisher>>(
      getRepositoryToken(Publisher),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new publisher', async () => {
      const createPublisherDto = {
        name: 'Test Publisher',
        address: 'Test Address',
      }; // Include required properties
      const expectedPublisher: Publisher = {
        // Assuming Publisher type has the correct structure
        id: '1',
        name: 'Test Publisher',
        address: 'Test Address',
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
        books: [],
      };
      jest
        .spyOn(publisherRepository, 'save')
        .mockResolvedValue(expectedPublisher);

      const result = await service.create(createPublisherDto);

      expect(result).toEqual({
        success: true,
        message: 'Publisher created successfully',
      });
    });
  });
});
