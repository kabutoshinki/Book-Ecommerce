import { Test, TestingModule } from '@nestjs/testing';
import { PublishersController } from './publishers.controller';
import { PublishersService } from './publishers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from './entities/publisher.entity';
import { Book } from '../books/entities/book.entity';

describe('PublishersController', () => {
  let controller: PublishersController;
  let service: PublishersService;
  let publisherRepository: Repository<Publisher>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishersController],
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

    controller = module.get<PublishersController>(PublishersController);
    service = module.get<PublishersService>(PublishersService);
    publisherRepository = module.get<Repository<Publisher>>(
      getRepositoryToken(Publisher),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all publishers', async () => {
      const publishers = [
        {
          id: '1',
          name: 'Publisher 1',
          address: 'abc',
          isActive: true,
          created_at: '7-6-2024',
          updated_at: '7-6-2024',
        },
        {
          id: '2',
          name: 'Publisher 2',
          address: 'abc',
          isActive: true,
          created_at: '7-6-2024',
          updated_at: '7-6-2024',
        },
      ]; // Mock publishers
      jest.spyOn(service, 'findAll').mockResolvedValue(publishers);

      const result = await controller.findAll();

      expect(result).toEqual(publishers);
    });
  });
});
