import { IsNotEmpty, IsUUID, IsInt, Min, IsString } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
