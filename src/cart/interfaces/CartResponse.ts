import { Book } from 'src/books/entities/book.entity';

export interface CartResponse {
  bookId: string;
  book: Book;
  quantity: number;
}
