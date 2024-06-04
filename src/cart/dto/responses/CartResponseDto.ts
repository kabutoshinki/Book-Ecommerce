import { BookClientResponseDto } from './../../../books/dto/responses/book-client-response.dto';

export class CartResponseDto {
  bookId: string;
  quantity: number;
  book: BookClientResponseDto;
}
