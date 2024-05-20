import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
