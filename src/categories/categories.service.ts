import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/requests/create-category.dto';
import { UpdateCategoryDto } from './dto/requests/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      await this.categoryRepository.save(createCategoryDto);
      return {
        success: true,
        message: 'Category created successfully',
      };
    } catch (error) {
      throw new BadRequestException({ message: 'Category name already exist' });
    }
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    const categories = await this.categoryRepository.findBy({ id: In(ids) });
    if (categories.length !== ids.length) {
      throw new NotFoundException('Some categories not found');
    }
    return categories;
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOneBy({ id: id });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOneBy({ id: id });
      if (!category) {
        throw new NotFoundException('Category Not Exist');
      }
      category.name = updateCategoryDto.name;
      category.description = updateCategoryDto.description;
      category.isActive = true;
      await this.categoryRepository.save(category);
      return {
        success: true,
        message: 'Category updated successfully',
      };
    } catch (error) {
      throw new BadRequestException({ message: 'Category name already exist' });
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    const books = await this.bookRepository.find({
      where: { categories: { id } },
    });
    if (books.length > 0) {
      throw new BadRequestException(
        'Category is associated with books and cannot be deleted',
      );
    }
    category.isActive = false;
    await this.categoryRepository.save(category);
    return `Category deleted`;
  }
}
