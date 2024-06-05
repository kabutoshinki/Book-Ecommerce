import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockAuthorRepository = {
    // mock repository methods as needed
  };
  const mockBookRepository = {
    // mock repository methods as needed
  };
  const mockCloudinaryService = {
    // mock service methods as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getRepositoryToken(Author), useValue: mockAuthorRepository },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository }, // Add this line
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add other test cases here...
});
