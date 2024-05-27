import { BookOrderResponseDto } from 'src/books/dto/responses/book-order-response.dto';
import { IsNotEmpty, IsUUID, IsInt } from 'class-validator';

export class OrderItemBooksResponseDto {
  id: string;

  book: BookOrderResponseDto;

  quantity: number;
}
