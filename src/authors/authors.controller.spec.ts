import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  const mockAuthorRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    // Add more mock functions as needed
  };
  const mockBookRepository = {};
  const mockCloudinaryService = {};

  const mockAuthorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        { provide: AuthorsService, useValue: mockAuthorsService },
        { provide: getRepositoryToken(Author), useValue: mockAuthorRepository },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository }, // Provide the mock BookRepository
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        description: 'author description',
        image: 'abcd',
      };
      const file = { originalname: 'test.jpg' } as Express.Multer.File;

      mockAuthorsService.create.mockResolvedValue({
        success: true,
        message: 'Author created successfully',
      });

      const result = await controller.create(file, createAuthorDto);

      expect(result).toEqual({
        success: true,
        message: 'Author created successfully',
      });
      expect(mockAuthorsService.create).toHaveBeenCalledWith(
        createAuthorDto,
        file,
      );
    });
  });

  // Add other test cases here...
});
