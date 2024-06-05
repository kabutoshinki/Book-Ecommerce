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
import { Book } from '../books/entities/book.entity';
import { CategoryMapper } from './categories.mapper';
import { CategoryResponseDto } from './dto/responses/category-response.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

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

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
    });
    return CategoryMapper.toCategoryResponseDtoList(categories);
  }

  async findAllForAdmin(
    options: IPaginationOptions,
  ): Promise<Pagination<Category>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.created_at', 'ASC'); // You can order by any column you want

    const [categories, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const paginationMeta = {
      totalItems,
      itemCount: categories.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return new Pagination<Category>(categories, paginationMeta);
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
