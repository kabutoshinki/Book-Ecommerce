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
import { Repository } from 'typeorm';
import { SubCategoriesService } from 'src/sub_categories/sub_categories.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => SubCategoriesService))
    private readonly subCategoryService: SubCategoriesService,
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
    const category = await this.categoryRepository.findOneBy({ id: id });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const subCategoryCount = await this.subCategoryService.countByCategoryId(
      id,
    );
    if (subCategoryCount > 0) {
      throw new BadRequestException(
        `Category with id ${id} cannot be deleted because it is referenced by subcategories`,
      );
    }
    await this.categoryRepository.remove(category);
    return 'Category deleted';
  }
}
