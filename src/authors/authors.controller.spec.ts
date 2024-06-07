import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  const mockAuthorRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const mockCloudinaryService = {
    upload: jest.fn(),
  };

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

  describe('findAll', () => {
    it('should return all authors', async () => {
      const authors = [{ id: '1', name: 'John Doe' }];
      mockAuthorsService.findAll.mockResolvedValue(authors);

      const result = await controller.findAll();

      expect(result).toEqual(authors);
      expect(mockAuthorsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      const author = { id: '1', name: 'John Doe' };
      mockAuthorsService.findOne.mockResolvedValue(author);

      const result = await controller.findOne('1');

      expect(result).toEqual(author);
      expect(mockAuthorsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = { name: 'Jane Doe' };
      const file = { originalname: 'test.jpg' } as Express.Multer.File;

      mockAuthorsService.update.mockResolvedValue({
        success: true,
        message: 'Author updated successfully',
      });

      const result = await controller.update(file, '1', updateAuthorDto);

      expect(result).toEqual({
        success: true,
        message: 'Author updated successfully',
      });
      expect(mockAuthorsService.update).toHaveBeenCalledWith(
        '1',
        updateAuthorDto,
        file,
      );
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      mockAuthorsService.remove.mockResolvedValue({
        success: true,
        message: 'Author deleted successfully',
      });

      const result = await controller.remove('1');

      expect(result).toEqual({
        success: true,
        message: 'Author deleted successfully',
      });
      expect(mockAuthorsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
