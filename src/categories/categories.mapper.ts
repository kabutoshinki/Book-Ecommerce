import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryResponseDto } from './dto/responses/category-response.dto';

@Injectable()
export class CategoryMapper {
  static toCategoryResponseDto(category: Category): CategoryResponseDto {
    const categoryResponseDto = new CategoryResponseDto();
    categoryResponseDto.id = category.id;
    categoryResponseDto.name = category.name;
    categoryResponseDto.description = category.description;
    return categoryResponseDto;
  }

  // for client
  static toCategoryResponseDtoList(
    categories: Category[],
  ): CategoryResponseDto[] {
    return categories.map((category) => this.toCategoryResponseDto(category));
  }
}
