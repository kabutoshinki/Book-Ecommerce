import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';
import { BookResponseDto } from 'src/books/dto/responses/book-response.dto';

export class OrderItemResponseDto {
  id: string;

  book: BookResponseDto;

  quantity: number;
}
