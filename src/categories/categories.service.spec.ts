import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Book } from '../books/entities/book.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: Repository<Category>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(createCategoryDto as Category);

      const result = await service.create(createCategoryDto);

      expect(result).toEqual({
        success: true,
        message: 'Category created successfully',
      });
    });

    it('should throw an error if category name already exists', async () => {
      const createCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };
      jest
        .spyOn(categoryRepository, 'save')
        .mockRejectedValue(new Error('Category name already exist'));

      await expect(service.create(createCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllForAdmin', () => {
    it('should return paginated categories', async () => {
      const categories = [
        { id: '1', name: 'Category 1', description: 'abc', isActive: true },
      ];
      jest.spyOn(categoryRepository, 'createQueryBuilder').mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([categories, 1]),
      } as any);

      const result = await service.findAllForAdmin({ page: 1, limit: 1 });

      expect(result.items).toEqual(categories);
      expect(result.meta.totalItems).toBe(1);
    });
  });

  describe('findByIds', () => {
    it('should return categories for valid ids', async () => {
      const categories = [
        { id: '1', name: 'Category 1', description: 'abc', isActive: true },
      ];
      jest
        .spyOn(categoryRepository, 'findBy')
        .mockResolvedValue(categories as Category[]);

      const result = await service.findByIds(['1']);

      expect(result).toEqual(categories);
    });

    it('should throw NotFoundException for invalid ids', async () => {
      jest.spyOn(categoryRepository, 'findBy').mockResolvedValue([]);

      await expect(service.findByIds(['1'])).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a category for a valid id', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'abc',
        isActive: true,
      };
      jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(category as Category);

      const result = await service.findOne('1');

      expect(result).toEqual(category);
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'abc',
        isActive: true,
      };
      const updateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(category as Category);
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue({ ...category, ...updateCategoryDto } as Category);

      const result = await service.update('1', updateCategoryDto);

      expect(result).toEqual({
        success: true,
        message: 'Category updated successfully',
      });
    });

    it('should throw BadRequestException if category name already exists', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'abc',
        isActive: true,
      };
      const updateCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };
      jest
        .spyOn(categoryRepository, 'findOneBy')
        .mockResolvedValue(category as Category);
      jest
        .spyOn(categoryRepository, 'save')
        .mockRejectedValue(new Error('Category name already exist'));

      await expect(service.update('1', updateCategoryDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a category successfully', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'abc',
        isActive: true,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(category as Category);
      jest.spyOn(bookRepository, 'find').mockResolvedValue([]);
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue({ ...category, isActive: false } as Category);

      const result = await service.remove('1');

      expect(result).toBe('Category deleted');
    });

    it('should throw BadRequestException if category is associated with books', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'abc',
        isActive: true,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(category as Category);
      jest
        .spyOn(bookRepository, 'find')
        .mockResolvedValue([{ id: '1', title: 'Book 1' }] as Book[]);

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });
  });
});
