import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub_category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub_category.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoryService: CategoriesService,
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const categoryExist = await this.categoryService.findOne(
      createSubCategoryDto.parent_id,
    );
    if (!categoryExist) {
      throw new NotFoundException('Category not exist');
    }
    const subCategory = { ...createSubCategoryDto, parent_id: categoryExist };
    this.subCategoryRepository.save(subCategory);
    return 'SubCategory created';
  }

  findAll() {
    return this.subCategoryRepository.find();
  }

  async findOne(id: string) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id: id });
    if (!subCategory) {
      throw new NotFoundException('Subcategory not found');
    }
    return subCategory;
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOneBy({ id: id });
    if (!subCategory) {
      throw new NotFoundException('SubCategory not exist');
    }
    subCategory.name = updateSubCategoryDto.name;
    subCategory.description = updateSubCategoryDto.description;
    await this.subCategoryRepository.save(subCategory);
    return 'SubCategory updated';
  }

  async remove(id: string) {
    await this.subCategoryRepository.delete(id);

    return 'SubCategory deleted';
  }

  async countByCategoryId(categoryId: string): Promise<number> {
    return this.subCategoryRepository.count({
      where: { parent_id: { id: categoryId } },
    });
  }
}
