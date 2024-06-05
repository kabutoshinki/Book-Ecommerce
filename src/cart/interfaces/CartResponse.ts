import { Book } from '../../books/entities/book.entity';

export interface CartResponse {
  bookId: string;
  book: Book;
  quantity: number;
}
