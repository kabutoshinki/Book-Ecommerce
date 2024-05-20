import { IsUUID, IsString, IsInt } from 'class-validator';

export class ReviewResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  content: string;

  @IsInt()
  rating: number;

  @IsUUID()
  bookId: string;

  @IsUUID()
  userId: string;
}
