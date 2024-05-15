import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<string> {
    try {
      await this.categoryRepository.save(createCategoryDto);
      return 'Category created';
    } catch (error) {
      throw new BadRequestException();
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

      await this.categoryRepository.save(category);
      return `Category updated`;
    } catch (error) {
      throw new BadRequestException('Category name already exist');
    }
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id);
    return 'Category deleted';
  }
}
