import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthorResponseDto } from './dto/responses/author-response.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockAuthorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };
  const mockBookRepository = {
    find: jest.fn(),
  };
  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getRepositoryToken(Author), useValue: mockAuthorRepository },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        description: 'description',
      };
      const file = {} as Express.Multer.File;
      const author = { ...createAuthorDto, image: 'image-url' };

      mockAuthorRepository.create.mockReturnValue(author);
      mockCloudinaryService.uploadFile.mockResolvedValue({
        secure_url: 'image-url',
      });
      mockAuthorRepository.save.mockResolvedValue(author);

      const result = await service.create(createAuthorDto, file);

      expect(result).toEqual({
        success: true,
        message: 'Author created successfully',
      });
      expect(mockAuthorRepository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(
        file,
        'authors',
      );
      expect(mockAuthorRepository.save).toHaveBeenCalledWith(author);
    });
  });

  describe('findByIds', () => {
    it('should return authors by ids', async () => {
      const ids = ['1', '2'];
      const authors = [
        { id: '1', name: 'Author 1' },
        { id: '2', name: 'Author 2' },
      ];

      mockAuthorRepository.findBy.mockResolvedValue(authors);

      const result = await service.findByIds(ids);

      expect(mockAuthorRepository.findBy).toHaveBeenCalledWith({
        id: expect.objectContaining({
          _type: 'in',
          _value: ids,
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all authors', async () => {
      const authors: AuthorResponseDto[] = [
        { id: '1', name: 'Author 1', image: 'abc', description: 'abcd' },
        { id: '2', name: 'Author 2', image: 'abc', description: 'abcd' },
      ];

      mockAuthorRepository.find.mockResolvedValue(authors);

      const result = await service.findAll();

      expect(result).toEqual(authors);
      expect(mockAuthorRepository.find).toHaveBeenCalled();
    });
  });
});
