import { Transform } from 'class-transformer';
import { BookListType, SortCriteria } from './../../../enums/book.enum';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';

export class GetBooksOptionsDto {
  @IsEnum(BookListType)
  type: BookListType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseFloat(value))
  limit?: number;

  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  sortBy?: SortCriteria[];
}
